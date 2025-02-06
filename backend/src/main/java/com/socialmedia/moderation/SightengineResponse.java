package com.socialmedia.moderation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SightengineResponse {
    private String status;
    private Request request;
    private NudityDetails nudity;
    private WeaponDetails weapon;
    private AlcoholDetails alcohol;

    @JsonProperty("recreational_drug")
    private DrugDetails drug;

    private GoreDetails gore;
    private TextDetails text;
    private ViolenceDetails violence;

    @JsonProperty("self-harm")
    private SelfHarmDetails selfHarm;

    private MedicalDetails medical;
    private MediaDetails media;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Request {
        private String id;
        private double timestamp;
        private int operations;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NudityDetails {
        @JsonProperty("sexual_activity")
        private double sexualActivity;
        @JsonProperty("sexual_display")
        private double sexualDisplay;
        private double erotica;
        @JsonProperty("very_suggestive")
        private double verySuggestive;
        private double suggestive;
        @JsonProperty("mildly_suggestive")
        private double mildlySuggestive;
        @JsonProperty("suggestive_classes")
        private Map<String, Object> suggestiveClasses;
        private double none;
        private Map<String, Double> context;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponDetails {
        private Map<String, Double> classes;
        @JsonProperty("firearm_type")
        private Map<String, Double> firearmType;
        @JsonProperty("firearm_action")
        private Map<String, Double> firearmAction;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DrugDetails {
        private double prob;
        private Map<String, Double> classes;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GoreDetails {
        private double prob;
        private Map<String, Double> classes;
        private Map<String, Double> type;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TextDetails {
        private List<String> profanity;
        private List<String> personal;
        private List<String> link;
        private List<String> social;
        @JsonProperty("has_artificial")
        private double hasArtificial;
        @JsonProperty("has_natural")
        private double hasNatural;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ViolenceDetails {
        private double prob;
        private Map<String, Double> classes;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SelfHarmDetails {
        private double prob;
        private Map<String, Double> type;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AlcoholDetails {
        private double prob;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MedicalDetails {
        private double prob;
        private Map<String, Double> classes;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MediaDetails {
        private String id;
        private String uri;
    }
}