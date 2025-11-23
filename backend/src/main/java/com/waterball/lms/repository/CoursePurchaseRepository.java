package com.waterball.lms.repository;

import com.waterball.lms.model.entity.CoursePurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for CoursePurchase entity
 */
@Repository
public interface CoursePurchaseRepository extends JpaRepository<CoursePurchase, Long> {

    /**
     * Check if a user has already purchased a specific course
     *
     * @param userId   User ID
     * @param courseId Course ID
     * @return true if purchase exists, false otherwise
     */
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    /**
     * Find all purchases made by a user
     *
     * @param userId User ID
     * @return List of purchases
     */
    List<CoursePurchase> findByUserId(Long userId);

    /**
     * Find a specific purchase record
     *
     * @param userId   User ID
     * @param courseId Course ID
     * @return Optional of purchase record
     */
    Optional<CoursePurchase> findByUserIdAndCourseId(Long userId, Long courseId);

    /**
     * Find all purchases for a specific course
     *
     * @param courseId Course ID
     * @return List of purchases
     */
    List<CoursePurchase> findByCourseId(Long courseId);
}
