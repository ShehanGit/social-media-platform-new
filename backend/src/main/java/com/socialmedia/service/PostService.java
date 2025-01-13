package com.socialmedia.service;

import com.socialmedia.dto.PostResponse;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.model.Post;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.user.User;
import com.socialmedia.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final String uploadDir = "uploads/";

    public Post createPost(String caption, MultipartFile mediaFile, String userEmail) throws IOException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String fileName = null;
        Post.MediaType mediaType = null;

        if (mediaFile != null && !mediaFile.isEmpty()) {
            fileName = UUID.randomUUID() + "_" + mediaFile.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Files.copy(mediaFile.getInputStream(), uploadPath.resolve(fileName));

            String contentType = mediaFile.getContentType();
            if (contentType != null) {
                if (contentType.startsWith("image/")) {
                    mediaType = Post.MediaType.IMAGE;
                } else if (contentType.startsWith("video/")) {
                    mediaType = Post.MediaType.VIDEO;
                }
            }
        }

        Post post = Post.builder()
                .caption(caption)
                .user(user)
                .mediaUrl(fileName != null ? "/media/" + fileName : null)
                .mediaType(mediaType)
                .build();

        return postRepository.save(post);
    }

    public Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
    }

    public Page<PostResponse> getAllPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(this::convertToPostResponse);
    }

    public Page<PostResponse> getPostsByLikes(Pageable pageable) {
        Page<Post> posts = postRepository.findAllByOrderByLikesDesc(pageable);
        return posts.map(this::convertToPostResponse);
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
                .likesCount(post.getLikes().size())
                .commentsCount(post.getComments().size())
                .build();
    }

    public Page<Post> getPostsByUser(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return postRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public Post updatePost(Long postId, String caption, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("User not authorized to update this post");
        }

        post.setCaption(caption);
        return postRepository.save(post);
    }

    public void deletePost(Long postId, String userEmail) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("User not authorized to delete this post");
        }

        if (post.getMediaUrl() != null) {
            String fileName = post.getMediaUrl().substring(post.getMediaUrl().lastIndexOf('/') + 1);
            Path filePath = Paths.get(uploadDir + fileName);
            Files.deleteIfExists(filePath);
        }

        postRepository.delete(post);
    }
}