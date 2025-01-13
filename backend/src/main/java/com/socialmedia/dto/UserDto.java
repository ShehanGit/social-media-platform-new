package com.socialmedia.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UserDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateRequest {
        private String username;
        private String firstname;
        private String lastname;
        private String bio;
        private String website;
        private String phone;
        private String location;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResponse {
        private Integer id;
        private String username;
        private String firstname;
        private String lastname;
        private String email;
        private String bio;
        private String profilePictureUrl;
        private String website;
        private String phone;
        private String location;
    }
}