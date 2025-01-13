package com.socialmedia.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
  Optional<User> findByEmail(String email);
  Optional<User> findByUsername(String username);
  boolean existsByEmail(String email);
  boolean existsByUsername(String username);

  @Query("SELECT u FROM User u WHERE " +
          "LOWER(u.firstname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
          "LOWER(u.lastname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
          "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))")
  Page<User> searchUsers(@Param("query") String query, Pageable pageable);

  @Query("SELECT u FROM User u WHERE u.id IN " +
          "(SELECT ur.following.id FROM UserRelationship ur WHERE ur.follower.id = :userId AND ur.status = 'ACCEPTED')")
  List<User> findFollowing(@Param("userId") Integer userId);

  @Query("SELECT u FROM User u WHERE u.id IN " +
          "(SELECT ur.follower.id FROM UserRelationship ur WHERE ur.following.id = :userId AND ur.status = 'ACCEPTED')")
  List<User> findFollowers(@Param("userId") Integer userId);

  @Query("SELECT COUNT(ur) FROM UserRelationship ur WHERE ur.following.id = :userId AND ur.status = 'ACCEPTED'")
  long countFollowers(@Param("userId") Integer userId);

  @Query("SELECT COUNT(ur) FROM UserRelationship ur WHERE ur.follower.id = :userId AND ur.status = 'ACCEPTED'")
  long countFollowing(@Param("userId") Integer userId);


}