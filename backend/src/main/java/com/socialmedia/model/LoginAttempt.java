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
@Table(name = "login_attempts")
public class LoginAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private boolean success;

    @Column(updatable = false)
    private LocalDateTime attemptTime;

    @PrePersist
    protected void onCreate() {
        attemptTime = LocalDateTime.now();
    }
}