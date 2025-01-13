package com.socialmedia.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class RecaptchaResponse {
    private boolean success;  // This will generate isSuccess() method
    private String hostname;
    @JsonProperty("challenge_ts")
    private String challengeTs;
    @JsonProperty("error-codes")
    private List<String> errorCodes;

    // Explicit getter if needed
    public boolean isSuccess() {
        return success;
    }
}