package com.waterball.lms.service;

import com.waterball.lms.model.dto.PurchaseDTO;
import com.waterball.lms.model.entity.Course;
import com.waterball.lms.model.entity.CoursePurchase;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.CoursePurchaseRepository;
import com.waterball.lms.repository.CourseRepository;
import com.waterball.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for handling course purchase operations
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseService {

    private final CoursePurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    /**
     * Purchase a course (mock payment for MVP)
     *
     * @param userEmail User email
     * @param courseId  Course ID
     * @return Purchase DTO
     * @throws IllegalArgumentException if user/course not found
     * @throws IllegalStateException    if course already purchased or is free
     */
    @Transactional
    public PurchaseDTO purchaseCourse(String userEmail, Long courseId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // 1. Check if already purchased (prevents duplicate purchases)
        if (purchaseRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new IllegalStateException("Course already purchased");
        }

        // 2. Check if course is premium (cannot purchase free courses)
        if (!course.getIsPremium()) {
            throw new IllegalArgumentException("Cannot purchase free course");
        }

        // 3. Create purchase record (mock payment - always COMPLETED)
        CoursePurchase purchase = CoursePurchase.builder()
                .user(user)
                .course(course)
                .purchasePrice(course.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId(generateMockTransactionId())
                .build();

        purchase = purchaseRepository.save(purchase);

        // Note: Role upgrade is NOT automatic per requirements
        // Admin must manually grant PAID role if needed

        return PurchaseDTO.from(purchase);
    }

    /**
     * Check if user has purchased a specific course
     *
     * @param userId   User ID
     * @param courseId Course ID
     * @return true if purchased, false otherwise
     */
    public boolean hasPurchased(Long userId, Long courseId) {
        return purchaseRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    /**
     * Check if user has access to a course
     * Access rules: Free course OR already purchased
     * Note: User role (FREE/PAID) is NOT checked per requirements
     *
     * @param userId   User ID
     * @param courseId Course ID
     * @return true if user can access, false otherwise
     */
    public boolean hasAccess(Long userId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Free courses are accessible to everyone
        if (!course.getIsPremium()) {
            return true;
        }

        // Premium courses require purchase
        return hasPurchased(userId, courseId);
    }

    /**
     * Get all purchases for a user
     *
     * @param userEmail User email
     * @return List of purchase DTOs
     */
    public List<PurchaseDTO> getMyPurchases(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return purchaseRepository.findByUserId(user.getId()).stream()
                .map(PurchaseDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific purchase record
     *
     * @param userId   User ID
     * @param courseId Course ID
     * @return Purchase DTO or null if not found
     */
    public PurchaseDTO getPurchase(Long userId, Long courseId) {
        return purchaseRepository.findByUserIdAndCourseId(userId, courseId)
                .map(PurchaseDTO::from)
                .orElse(null);
    }

    /**
     * Generate mock transaction ID for MVP
     * Format: MOCK-{UUID}
     *
     * @return Transaction ID
     */
    private String generateMockTransactionId() {
        return "MOCK-" + UUID.randomUUID().toString();
    }
}
