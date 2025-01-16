package com.socialmedia.model;

import com.socialmedia.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_relationships",
        uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}),
        indexes = {
                @Index(name = "idx_relationship_follower", columnList = "follower_id"),
                @Index(name = "idx_relationship_following", columnList = "following_id"),
                @Index(name = "idx_relationship_status", columnList = "follower_id, following_id, status, isBlocked")
        }
)
public class UserRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    private User following;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private boolean isMuted;
    private boolean isClose;
    private boolean isBlocked;
    private String notificationPreference;

    @Enumerated(EnumType.STRING)
    private RelationshipStatus status;

    public enum RelationshipStatus {
        PENDING,
        ACCEPTED,
        BLOCKED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = RelationshipStatus.ACCEPTED;
        }
        if (notificationPreference == null) {
            notificationPreference = "ALL";
        }
    }

    public boolean isActive() {
        return status == RelationshipStatus.ACCEPTED && !isBlocked;
    }

    public boolean canInteract() {
        return isActive() && !isMuted;
    }

    public boolean canReceiveNotifications() {
        return canInteract() && !"NONE".equals(notificationPreference);
    }
}