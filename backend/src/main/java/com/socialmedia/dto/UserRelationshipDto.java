package com.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UserRelationshipDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserSummary {
        private Integer id;
        private String email;
        private String firstname;
        private String lastname;
        private boolean isFollowing;
        private String profilePictureUrl;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RelationshipStats {
        private long followersCount;
        private long followingCount;
        private boolean isFollowing;
    }
}