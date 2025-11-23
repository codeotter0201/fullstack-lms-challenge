package com.waterball.lms.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * UserRole entity represents role assignments for users.
 * Supports multiple roles per user (e.g., a user can be both STUDENT and PAID).
 */
@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRole extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRoleType role;

    @Column(name = "granted_at", nullable = false)
    private LocalDateTime grantedAt;

    /**
     * User role types
     */
    public enum UserRoleType {
        FREE,     // Free tier user
        PAID,     // Paid tier user (has purchased at least one course or subscription)
        ADMIN,    // Administrator
        TEACHER   // Course instructor
    }

    @PrePersist
    protected void onPrePersist() {
        if (grantedAt == null) {
            grantedAt = LocalDateTime.now();
        }
    }
}
