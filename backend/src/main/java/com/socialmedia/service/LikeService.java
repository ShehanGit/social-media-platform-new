package com.socialmedia.service;

import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.model.Like;

import com.socialmedia.model.Post;
import com.socialmedia.repository.LikeRepository;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.user.User;

import com.socialmedia.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public void toggleLike(Long postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not  found"));


        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found "));

        if (likeRepository.existsByUserAndPost(user, post)) {
            likeRepository.deleteByUserAndPost(user, post);
        } else {
            Like like = Like.builder()
                    .user(user)
                    .post(post)
                    .build();
            likeRepository.save(like);
        }
    }

    public boolean hasUserLikedPost(Long postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return likeRepository.existsByUserAndPost(user, post);
    }


    public long getLikesCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post nt found"));



        return likeRepository.countByPost(post);
    }

    public void validateAndGetLike(Long postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

             Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found "));

        likeRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found"));
    }
}