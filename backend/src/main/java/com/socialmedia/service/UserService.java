package com.socialmedia.service;

import com.socialmedia.dto.UserDto;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.user.User;
import com.socialmedia.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public User updateUser(String email, UserDto.UpdateRequest request) {
        User user = getUserByEmail(email);

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalStateException("Username already taken");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getWebsite() != null) {
            user.setWebsite(request.getWebsite());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getFirstname() != null) {
            user.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null) {
            user.setLastname(request.getLastname());
        }

        return userRepository.save(user);
    }

    public UserDto.UserResponse convertToUserResponse(User user) {
        return UserDto.UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePictureUrl())
                .website(user.getWebsite())
                .phone(user.getPhone())
                .location(user.getLocation())
                .build();
    }

    public Page<User> searchUsers(String query, Pageable pageable) {
        return userRepository.searchUsers(query, pageable);
    }

    public Map<String, Long> getUserStats(Integer userId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("followersCount", userRepository.countFollowers(userId));
        stats.put("followingCount", userRepository.countFollowing(userId));
        return stats;
    }

    @Transactional
    public void updateProfilePicture(String email, String pictureUrl) {
        User user = getUserByEmail(email);
        user.setProfilePictureUrl(pictureUrl);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String email) {
        User user = getUserByEmail(email);
        userRepository.delete(user);
    }
}