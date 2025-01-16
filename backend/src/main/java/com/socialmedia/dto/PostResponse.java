package com.socialmedia.dto;

import com.socialmedia.model.Post;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String caption;
    private String mediaUrl;
    private Post.MediaType mediaType;
    private String createdAt;
    private String updatedAt;
    private UserSummary user;
    private long likesCount;
    private long commentsCount;

    @Data
    @Builder
    public static class UserSummary {
        private Integer id;
        private String username;
        private String firstname;
        private String lastname;
        private String profilePictureUrl;
    }
}