package com.socialmedia.service;

import com.socialmedia.dto.UserRelationshipDto;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.model.UserRelationship;
import com.socialmedia.repository.UserRelationshipRepository;
import com.socialmedia.user.User;
import com.socialmedia.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserRelationshipService {
    private final UserRelationshipRepository relationshipRepository;
    private final UserRepository userRepository;

    @Transactional
    public void toggleFollow(String followerEmail, Integer followingId) {
        if (followingId == null) {
            throw new IllegalArgumentException("Following ID cannot be null");
        }

        User follower = userRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Follower user not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new ResourceNotFoundException("Following user not found"));

        if (follower.getId().equals(following.getId())) {
            throw new IllegalArgumentException("Users cannot follow themselves");
        }

        relationshipRepository.findByFollowerAndFollowing(follower, following)
                .ifPresentOrElse(
                        relationship -> relationshipRepository.delete(relationship),
                        () -> {
                            UserRelationship newRelationship = UserRelationship.builder()
                                    .follower(follower)
                                    .following(following)
                                    .build();
                            relationshipRepository.save(newRelationship);
                        }
                );
    }

    public UserRelationshipDto.RelationshipStats getRelationshipStats(Integer userId, String currentUserEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long followersCount = relationshipRepository.countByFollowing(user);
        long followingCount = relationshipRepository.countByFollower(user);

        boolean isFollowing = false;
        if (currentUserEmail != null) {
            User currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            isFollowing = relationshipRepository.existsByFollowerAndFollowing(currentUser, user);
        }

        return UserRelationshipDto.RelationshipStats.builder()
                .followersCount(followersCount)
                .followingCount(followingCount)
                .isFollowing(isFollowing)
                .build();
    }

    public Page<UserRelationshipDto.UserSummary> getFollowers(Integer userId, String currentUserEmail, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User currentUser = currentUserEmail != null ?
                userRepository.findByEmail(currentUserEmail).orElse(null) : null;

        Page<UserRelationship> relationships = relationshipRepository.findByFollowing(user, pageable);

        return relationships.map(relationship -> {
            User follower = relationship.getFollower();
            boolean isFollowing = currentUser != null &&
                    relationshipRepository.existsByFollowerAndFollowing(currentUser, follower);

            return UserRelationshipDto.UserSummary.builder()
                    .id(follower.getId())
                    .email(follower.getEmail())
                    .firstname(follower.getFirstname())
                    .lastname(follower.getLastname())
                    .isFollowing(isFollowing)
                    .build();
        });
    }

    public Page<UserRelationshipDto.UserSummary> getFollowing(Integer userId, String currentUserEmail, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User currentUser = currentUserEmail != null ?
                userRepository.findByEmail(currentUserEmail).orElse(null) : null;

        Page<UserRelationship> relationships = relationshipRepository.findByFollower(user, pageable);

        return relationships.map(relationship -> {
            User following = relationship.getFollowing();
            boolean isFollowing = currentUser != null &&
                    relationshipRepository.existsByFollowerAndFollowing(currentUser, following);

            return UserRelationshipDto.UserSummary.builder()
                    .id(following.getId())
                    .email(following.getEmail())
                    .firstname(following.getFirstname())
                    .lastname(following.getLastname())
                    .isFollowing(isFollowing)
                    .build();
        });
    }
    public Map<String, Object> getDetailedRelationshipStatus(Integer targetUserId, String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        Optional<UserRelationship> relationship =
                relationshipRepository.findByFollowerAndFollowing(currentUser, targetUser);

        Map<String, Object> status = new HashMap<>();
        if (relationship.isPresent()) {
            UserRelationship rel = relationship.get();
            status.put("status", rel.getStatus());
            status.put("isMuted", rel.isMuted());
            status.put("isBlocked", rel.isBlocked());
            status.put("isClose", rel.isClose());
            status.put("notificationPreference", rel.getNotificationPreference());
            status.put("following", true);
        } else {
            status.put("status", "NOT_FOLLOWING");
            status.put("isMuted", false);
            status.put("isBlocked", false);
            status.put("isClose", false);
            status.put("notificationPreference", "NONE");
            status.put("following", false);
        }

        // Check if target user is following current user
        boolean isFollowedBack = relationshipRepository
                .existsByFollowerAndFollowing(targetUser, currentUser);
        status.put("isFollowedBack", isFollowedBack);

        return status;
    }

    @Transactional
    public void toggleBlock(String currentUserEmail, Integer targetUserId) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        relationshipRepository.findByFollowerAndFollowing(currentUser, targetUser)
                .ifPresentOrElse(
                        relationship -> {
                            relationship.setBlocked(!relationship.isBlocked());
                            if (relationship.isBlocked()) {
                                relationship.setStatus(UserRelationship.RelationshipStatus.BLOCKED);
                            } else {
                                relationship.setStatus(UserRelationship.RelationshipStatus.ACCEPTED);
                            }
                            relationshipRepository.save(relationship);
                        },
                        () -> {
                            UserRelationship relationship = UserRelationship.builder()
                                    .follower(currentUser)
                                    .following(targetUser)
                                    .isBlocked(true)
                                    .status(UserRelationship.RelationshipStatus.BLOCKED)
                                    .build();
                            relationshipRepository.save(relationship);
                        }
                );
    }

    @Transactional
    public void toggleMute(String currentUserEmail, Integer targetUserId) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        UserRelationship relationship = relationshipRepository
                .findByFollowerAndFollowing(currentUser, targetUser)
                .orElseThrow(() -> new IllegalStateException("Must be following user to mute them"));

        relationship.setMuted(!relationship.isMuted());
        relationshipRepository.save(relationship);
    }

    @Transactional
    public void toggleCloseFriend(String currentUserEmail, Integer targetUserId) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        UserRelationship relationship = relationshipRepository
                .findByFollowerAndFollowing(currentUser, targetUser)
                .orElseThrow(() -> new IllegalStateException("Must be following user to add them to close friends"));

        relationship.setClose(!relationship.isClose());
        relationshipRepository.save(relationship);
    }
}
