package com.socialmedia.service;

import com.socialmedia.config.SightengineConfig;
import com.socialmedia.moderation.ModerationResult;
import com.socialmedia.moderation.SightengineResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageModerationService {
    private final SightengineConfig config;
    private final RestTemplate restTemplate;
    private static final String API_URL = "https://api.sightengine.com/1.0/check.json";

    public ModerationResult moderateImage(MultipartFile file) throws IOException {
        if (!config.isEnabled()) {
            return createApprovedResult();
        }

        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("api_user", config.getApiUser());
            body.add("api_secret", config.getApiSecret());
            body.add("models", config.getModels());
            body.add("media", file.getResource());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<SightengineResponse> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    requestEntity,
                    SightengineResponse.class
            );

            if (response.getBody() == null) {
                log.error("Received null response from Sightengine API");
                throw new IllegalStateException("Failed to process image moderation");
            }

            return evaluateResponse(response.getBody());
        } catch (Exception e) {
            log.error("Error during image moderation", e);
            throw new IllegalStateException("Failed to process image moderation: " + e.getMessage());
        }
    }

    private ModerationResult evaluateResponse(SightengineResponse response) {
        List<String> reasons = new ArrayList<>();

        // Check nudity
        if (response.getNudity() != null) {
            double nudityScore = Math.max(
                    Math.max(response.getNudity().getSexualActivity(),
                            response.getNudity().getSexualDisplay()),
                    Math.max(response.getNudity().getErotica(),
                            1 - response.getNudity().getNone())
            );
            if (nudityScore > config.getThresholds().getNudity()) {
                reasons.add("Inappropriate content detected");
            }
        }

        // Check weapon
        if (response.getWeapon() != null &&
                response.getWeapon().getClasses() != null &&
                !response.getWeapon().getClasses().isEmpty()) {
            double weaponScore = response.getWeapon().getClasses().values().stream()
                    .mapToDouble(v -> v)
                    .max()
                    .orElse(0.0);
            if (weaponScore > config.getThresholds().getWeapon()) {
                reasons.add("Weapon content detected");
            }
        }

        // Check violence
        if (response.getViolence() != null && response.getViolence().getProb() > config.getThresholds().getViolence()) {
            reasons.add("Violent content detected");
        }

        // Check gore
        if (response.getGore() != null && response.getGore().getProb() > config.getThresholds().getGore()) {
            reasons.add("Gore content detected");
        }

        // Check drugs
        if (response.getDrug() != null && response.getDrug().getProb() > config.getThresholds().getDrug()) {
            reasons.add("Drug-related content detected");
        }

        // Check self-harm
        if (response.getSelfHarm() != null && response.getSelfHarm().getProb() > config.getThresholds().getSelfHarm()) {
            reasons.add("Self-harm content detected");
        }

        return ModerationResult.builder()
                .approved(reasons.isEmpty())
                .reason(reasons.isEmpty() ? null : String.join(", ", reasons))
                .rawResponse(response)
                .build();
    }

    private ModerationResult createApprovedResult() {
        return ModerationResult.builder()
                .approved(true)
                .build();
    }
}