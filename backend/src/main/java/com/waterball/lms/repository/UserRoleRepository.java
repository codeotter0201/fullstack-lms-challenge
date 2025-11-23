package com.waterball.lms.repository;

import com.waterball.lms.model.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for UserRole entity
 */
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    /**
     * Find all roles for a specific user
     *
     * @param userId User ID
     * @return List of user roles
     */
    List<UserRole> findByUserId(Long userId);

    /**
     * Check if a user has a specific role
     *
     * @param userId User ID
     * @param role   Role type
     * @return true if user has the role, false otherwise
     */
    boolean existsByUserIdAndRole(Long userId, UserRole.UserRoleType role);

    /**
     * Delete a specific role from a user
     *
     * @param userId User ID
     * @param role   Role type
     */
    void deleteByUserIdAndRole(Long userId, UserRole.UserRoleType role);
}
