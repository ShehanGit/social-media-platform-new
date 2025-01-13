package com.socialmedia.controller;

import com.socialmedia.dto.CommentDto;
import com.socialmedia.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;



    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDto.Response> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentDto.Request request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        CommentDto.Response response = commentService.createComment(postId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<Page<CommentDto.Response>> getPostComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<CommentDto.Response> comments = commentService.getPostComments(postId, userDetails.getUsername(), pageRequest);
        return ResponseEntity.ok(comments);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentDto.Response> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentDto.Request request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        CommentDto.Response response = commentService.updateComment(commentId, request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        commentService.deleteComment(commentId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{postId}/comments/count")
    public ResponseEntity<Map<String, Long>> getCommentsCount(@PathVariable Long postId) {
        long count = commentService.getCommentsCount(postId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}