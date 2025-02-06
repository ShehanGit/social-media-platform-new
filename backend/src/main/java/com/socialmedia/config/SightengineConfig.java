package com.socialmedia.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "sightengine")
public class SightengineConfig {
    private String apiUser;
    private String apiSecret;
    private String models;
    private boolean enabled;
    private Thresholds thresholds;

    @Data
    public static class Thresholds {
        private double nudity;
        private double weapon;
        private double violence;
        private double gore;
        private double drug;
        private double selfHarm;
    }
}