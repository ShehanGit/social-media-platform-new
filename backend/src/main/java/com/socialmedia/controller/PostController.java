package com.socialmedia.controller;

import com.socialmedia.dto.PostDto;
import com.socialmedia.dto.PostResponse;
import com.socialmedia.model.Post;
import com.socialmedia.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Post> createPost(
            @RequestParam("caption") String caption,
            @RequestParam(value = "media", required = false) MultipartFile media,
            @AuthenticationPrincipal UserDetails userDetails
    ) throws IOException {
        Post post = postService.createPost(caption, media, userDetails.getUsername());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPost(postId));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return ResponseEntity.ok(postService.getAllPosts(pageRequest));
    }

    @GetMapping("/by-likes")
    public ResponseEntity<Page<PostResponse>> getPostsByLikes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getPostsByLikes(pageRequest));
    }


    @GetMapping("/user")
    public ResponseEntity<Page<Post>> getUserPosts(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getPostsByUser(userDetails.getUsername(), pageRequest));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long postId,
            @RequestParam String caption,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Post updatedPost = postService.updatePost(postId, caption, userDetails.getUsername());
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails
    ) throws IOException {
        postService.deletePost(postId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}