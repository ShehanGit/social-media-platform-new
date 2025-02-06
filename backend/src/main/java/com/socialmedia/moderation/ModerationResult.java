package com.socialmedia.moderation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationResult {
    private boolean approved;
    private String reason;
    private List<ViolationType> violations;
    private SightengineResponse rawResponse;

    public enum ViolationType {
        NUDITY("Inappropriate content detected"),
        WEAPON("Weapon content detected"),
        VIOLENCE("Violent content detected"),
        GORE("Gore content detected"),
        DRUGS("Drug-related content detected"),
        SELF_HARM("Self-harm content detected"),
        ALCOHOL("Alcohol-related content detected"),
        HATE_SPEECH("Hate speech detected"),
        EXPLICIT("Explicit content detected");

        private final String description;

        ViolationType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ViolationDetail {
        private ViolationType type;
        private double confidence;
        private String details;
    }

    public void addViolation(ViolationType type) {
        if (violations == null) {
            violations = new java.util.ArrayList<>();
        }
        violations.add(type);
        updateReason();
    }

    private void updateReason() {
        if (violations == null || violations.isEmpty()) {
            reason = null;
            approved = true;
            return;
        }

        approved = false;
        reason = violations.stream()
                .map(ViolationType::getDescription)
                .distinct()
                .collect(java.util.stream.Collectors.joining(", "));
    }

    public static ModerationResult createApproved() {
        return ModerationResult.builder()
                .approved(true)
                .build();
    }

    public static ModerationResult createRejected(String reason, List<ViolationType> violations) {
        return ModerationResult.builder()
                .approved(false)
                .reason(reason)
                .violations(violations)
                .build();
    }
}