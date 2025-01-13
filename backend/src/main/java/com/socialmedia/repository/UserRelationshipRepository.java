package com.socialmedia.repository;

import com.socialmedia.model.UserRelationship;
import com.socialmedia.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRelationshipRepository extends JpaRepository<UserRelationship, Long> {
    Optional<UserRelationship> findByFollowerAndFollowing(User follower, User following);
    boolean existsByFollowerAndFollowing(User follower, User following);
    Page<UserRelationship> findByFollower(User follower, Pageable pageable);
    Page<UserRelationship> findByFollowing(User following, Pageable pageable);
    long countByFollower(User follower);
    long countByFollowing(User following);
}