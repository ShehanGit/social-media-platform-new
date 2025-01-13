package com.socialmedia.dto;

import com.socialmedia.model.Post.MediaType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostRequest {
    @NotBlank(message = "Caption cannot be empty")
    private String caption;
    private String mediaUrl;
    private MediaType mediaType;
}