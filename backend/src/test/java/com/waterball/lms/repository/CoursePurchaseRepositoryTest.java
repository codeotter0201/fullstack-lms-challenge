package com.waterball.lms.repository;

import com.waterball.lms.model.entity.Course;
import com.waterball.lms.model.entity.CoursePurchase;
import com.waterball.lms.model.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Repository tests for CoursePurchase
 */
@DataJpaTest
@ActiveProfiles("test")
class CoursePurchaseRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private CoursePurchaseRepository purchaseRepository;

    private User testUser;
    private Course testCourse1;
    private Course testCourse2;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = User.builder()
                .email("test@example.com")
                .password("password")
                .displayName("Test User")
                .build();
        entityManager.persist(testUser);

        // Create test courses
        testCourse1 = Course.builder()
                .title("Test Course 1")
                .isPremium(true)
                .price(new BigDecimal("2990.00"))
                .build();
        entityManager.persist(testCourse1);

        testCourse2 = Course.builder()
                .title("Test Course 2")
                .isPremium(true)
                .price(new BigDecimal("3990.00"))
                .build();
        entityManager.persist(testCourse2);

        entityManager.flush();
    }

    @Test
    void shouldSavePurchase() {
        // Given
        CoursePurchase purchase = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId("MOCK-123")
                .build();

        // When
        CoursePurchase saved = purchaseRepository.save(purchase);

        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUser().getId()).isEqualTo(testUser.getId());
        assertThat(saved.getCourse().getId()).isEqualTo(testCourse1.getId());
        assertThat(saved.getPurchasePrice()).isEqualByComparingTo(new BigDecimal("2990.00"));
    }

    @Test
    void shouldCheckIfPurchaseExists() {
        // Given
        CoursePurchase purchase = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .build();
        entityManager.persist(purchase);
        entityManager.flush();

        // When
        boolean exists = purchaseRepository.existsByUserIdAndCourseId(
                testUser.getId(), testCourse1.getId());
        boolean notExists = purchaseRepository.existsByUserIdAndCourseId(
                testUser.getId(), testCourse2.getId());

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    void shouldFindPurchaseByUserIdAndCourseId() {
        // Given
        CoursePurchase purchase = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId("MOCK-456")
                .build();
        entityManager.persist(purchase);
        entityManager.flush();

        // When
        Optional<CoursePurchase> found = purchaseRepository.findByUserIdAndCourseId(
                testUser.getId(), testCourse1.getId());

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getTransactionId()).isEqualTo("MOCK-456");
    }

    @Test
    void shouldFindAllPurchasesByUserId() {
        // Given
        CoursePurchase purchase1 = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .build();
        CoursePurchase purchase2 = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse2)
                .purchasePrice(testCourse2.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .build();
        entityManager.persist(purchase1);
        entityManager.persist(purchase2);
        entityManager.flush();

        // When
        List<CoursePurchase> purchases = purchaseRepository.findByUserId(testUser.getId());

        // Then
        assertThat(purchases).hasSize(2);
        assertThat(purchases)
                .extracting(CoursePurchase::getCourse)
                .extracting(Course::getId)
                .containsExactlyInAnyOrder(testCourse1.getId(), testCourse2.getId());
    }

    @Test
    void shouldFindAllPurchasesByCourseId() {
        // Given
        User anotherUser = User.builder()
                .email("another@example.com")
                .password("password")
                .displayName("Another User")
                .build();
        entityManager.persist(anotherUser);

        CoursePurchase purchase1 = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .build();
        CoursePurchase purchase2 = CoursePurchase.builder()
                .user(anotherUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .build();
        entityManager.persist(purchase1);
        entityManager.persist(purchase2);
        entityManager.flush();

        // When
        List<CoursePurchase> purchases = purchaseRepository.findByCourseId(testCourse1.getId());

        // Then
        assertThat(purchases).hasSize(2);
        assertThat(purchases)
                .extracting(CoursePurchase::getUser)
                .extracting(User::getId)
                .containsExactlyInAnyOrder(testUser.getId(), anotherUser.getId());
    }

    @Test
    void shouldPreventDuplicatePurchase() {
        // Given
        CoursePurchase purchase1 = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .build();
        entityManager.persist(purchase1);
        entityManager.flush();

        // When/Then - Attempting to create duplicate should fail
        CoursePurchase duplicate = CoursePurchase.builder()
                .user(testUser)
                .course(testCourse1)
                .purchasePrice(testCourse1.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .build();

        try {
            entityManager.persist(duplicate);
            entityManager.flush();
            // Should throw exception due to unique constraint
            assertThat(false).isTrue(); // Fail if no exception thrown
        } catch (Exception e) {
            // Expected - unique constraint violation
            assertThat(e).isNotNull();
        }
    }
}
