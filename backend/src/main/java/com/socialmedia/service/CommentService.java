package com.socialmedia.service;

import com.socialmedia.dto.CommentDto;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.model.Comment;
import com.socialmedia.model.Post;
import com.socialmedia.repository.CommentRepository;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.user.User;
import com.socialmedia.user.UserRepository;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public CommentDto.Response createComment(Long postId, CommentDto.Request request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .user(user)
                .post(post)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return convertToDto(savedComment, userEmail);
    }

    public Page<CommentDto.Response> getPostComments(Long postId, String userEmail, Pageable pageable) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Page<Comment> comments = commentRepository.findByPostOrderByCreatedAtDesc(post, pageable);
        return comments.map(comment -> convertToDto(comment, userEmail));
    }

    @Transactional
    public CommentDto.Response updateComment(Long commentId, CommentDto.Request request, String userEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Not authorized to update this comment");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return convertToDto(updatedComment, userEmail);
    }


    @Transactional
    public void deleteComment(Long commentId, String userEmail) {
             Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

            if (!comment.getUser().getEmail().equals(userEmail) &&
                !comment.getPost().getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    public long getCommentsCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return commentRepository.countByPost(post);
    }

    private CommentDto.Response convertToDto(Comment comment, String currentUserEmail) {
        return CommentDto.Response.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userEmail(comment.getUser().getEmail())
                .userName(comment.getUser().getFirstname() + " " + comment.getUser().getLastname())
                .createdAt(comment.getCreatedAt().format(formatter))
                .updatedAt(comment.getUpdatedAt().format(formatter))
                .isAuthor(comment.getUser().getEmail().equals(currentUserEmail))
                .build();
    }
}