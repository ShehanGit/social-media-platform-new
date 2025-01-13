package com.socialmedia.controller;

import com.socialmedia.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        likeService.toggleLike(postId, userDetails.getUsername());
        boolean isLiked = likeService.hasUserLikedPost(postId, userDetails.getUsername());
        long likeCount = likeService.getLikesCount(postId);

        return ResponseEntity.ok(Map.of(
                "liked", isLiked,
                "likeCount", likeCount
        ));
    }

    @GetMapping("/{postId}/like/status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean isLiked = likeService.hasUserLikedPost(postId, userDetails.getUsername());
        long likeCount = likeService.getLikesCount(postId);

        return ResponseEntity.ok(Map.of(
                "liked", isLiked,
                "likeCount", likeCount
        ));
    }

    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<Map<String, Long>> getLikesCount(@PathVariable Long postId) {
        long count = likeService.getLikesCount(postId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}