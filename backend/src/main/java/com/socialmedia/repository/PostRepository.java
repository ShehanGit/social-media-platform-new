package com.socialmedia.repository;


import com.socialmedia.model.Post;
import com.socialmedia.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface PostRepository extends JpaRepository<Post, Long> {
    // Find posts from followed users ordered by creation date
    @Query(value = """
            SELECT DISTINCT p.* FROM posts p 
            INNER JOIN user_relationships ur ON p.user_id = ur.following_id 
            WHERE (ur.follower_id = :#{#currentUser.id} 
                AND ur.status = 'ACCEPTED' 
                AND ur.is_blocked = false)
            OR p.user_id = :#{#currentUser.id}
            ORDER BY p.created_at DESC
            """,
            countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM posts p 
            INNER JOIN user_relationships ur ON p.user_id = ur.following_id 
            WHERE (ur.follower_id = :#{#currentUser.id} 
                AND ur.status = 'ACCEPTED' 
                AND ur.is_blocked = false)
            OR p.user_id = :#{#currentUser.id}
            """,
            nativeQuery = true)
    Page<Post> findFollowedUsersPosts(@Param("currentUser") User currentUser, Pageable pageable);

    // Find posts from followed users ordered by likes count
    @Query(value = """
            SELECT DISTINCT p.*, COUNT(l.id) as like_count FROM posts p 
            LEFT JOIN likes l ON p.id = l.post_id 
            INNER JOIN user_relationships ur ON p.user_id = ur.following_id 
            WHERE (ur.follower_id = :#{#currentUser.id} 
                AND ur.status = 'ACCEPTED' 
                AND ur.is_blocked = false)
            OR p.user_id = :#{#currentUser.id}
            GROUP BY p.id 
            ORDER BY like_count DESC
            """,
            countQuery = """
            SELECT COUNT(DISTINCT p.id) FROM posts p 
            INNER JOIN user_relationships ur ON p.user_id = ur.following_id 
            WHERE (ur.follower_id = :#{#currentUser.id} 
                AND ur.status = 'ACCEPTED' 
                AND ur.is_blocked = false)
            OR p.user_id = :#{#currentUser.id}
            """,
            nativeQuery = true)
    Page<Post> findFollowedUsersPostsByLikes(@Param("currentUser") User currentUser, Pageable pageable);

    // Find posts by specific user
    @Query(value = "SELECT p FROM Post p WHERE p.user = :user ORDER BY p.createdAt DESC")
    Page<Post> findByUserOrderByCreatedAtDesc(@Param("user") User user, Pageable pageable);

    // Find all posts for explore feature
    @Query(value = "SELECT p FROM Post p ORDER BY p.createdAt DESC")
    Page<Post> findAllPostsOrderByCreatedAtDesc(Pageable pageable);

    @Query(value = """
            SELECT p.*, COUNT(l.id) as like_count FROM posts p 
            LEFT JOIN likes l ON p.id = l.post_id 
            GROUP BY p.id 
            ORDER BY like_count DESC
            """,
            countQuery = "SELECT COUNT(*) FROM posts",
            nativeQuery = true)
    Page<Post> findAllPostsOrderByLikesDesc(Pageable pageable);
}