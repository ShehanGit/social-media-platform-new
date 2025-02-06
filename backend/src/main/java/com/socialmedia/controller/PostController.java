package com.socialmedia.controller;

import com.socialmedia.dto.PostDto;
import com.socialmedia.dto.PostResponse;
import com.socialmedia.model.Post;
import com.socialmedia.service.PostService;
import com.socialmedia.user.User;
import com.socialmedia.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final UserRepository userRepository;

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<?> createPost(
            @RequestParam("caption") String caption,
            @RequestParam(value = "media", required = false) MultipartFile media,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            Post post = postService.createPost(caption, media, userDetails.getUsername());
            return ResponseEntity.ok(post);
        } catch (IllegalStateException e) {
            // Handle moderation failure
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "Content moderation failed",
                            "message", e.getMessage()
                    ));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Failed to process image",
                            "message", e.getMessage()
                    ));
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(postService.getPost(postId));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getFeedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        PageRequest pageRequest = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getFeedPosts(currentUser, pageRequest));
    }

    @GetMapping("/by-likes")
    public ResponseEntity<Page<PostResponse>> getFeedPostsByLikes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        PageRequest pageRequest = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getFeedPostsByLikes(currentUser, pageRequest));
    }

    private PostResponse convertToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .caption(post.getCaption())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .createdAt(post.getCreatedAt().toString())
                .updatedAt(post.getUpdatedAt().toString())
                .user(PostResponse.UserSummary.builder()
                        .id(post.getUser().getId())
                        .username(post.getUser().getUsername())
                        .profilePictureUrl(post.getUser().getProfilePictureUrl())
                        .build())
                .likesCount(post.getLikes() != null ? post.getLikes().size() : 0)  // Added null check
                .commentsCount(post.getComments() != null ? post.getComments().size() : 0)  // Added null check
                .build();
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