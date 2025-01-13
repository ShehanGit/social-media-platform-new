package com.socialmedia.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostDto {
    private Long id;
    private String caption;
    private String mediaUrl;
    private String userEmail;
    private LocalDateTime createdAt;
    private Long likesCount;
}
