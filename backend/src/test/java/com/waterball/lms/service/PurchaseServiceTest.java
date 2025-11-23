package com.waterball.lms.service;

import com.waterball.lms.model.dto.PurchaseDTO;
import com.waterball.lms.model.entity.Course;
import com.waterball.lms.model.entity.CoursePurchase;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.CoursePurchaseRepository;
import com.waterball.lms.repository.CourseRepository;
import com.waterball.lms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for PurchaseService
 */
@ExtendWith(MockitoExtension.class)
class PurchaseServiceTest {

    @Mock
    private CoursePurchaseRepository purchaseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private PurchaseService purchaseService;

    private User testUser;
    private Course freeCourse;
    private Course premiumCourse;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .displayName("Test User")
                .build();

        freeCourse = Course.builder()
                .id(1L)
                .title("Free Course")
                .isPremium(false)
                .price(BigDecimal.ZERO)
                .build();

        premiumCourse = Course.builder()
                .id(2L)
                .title("Premium Course")
                .isPremium(true)
                .price(new BigDecimal("2990.00"))
                .build();
    }

    @Test
    void shouldPurchaseCourseSuccessfully() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(2L)).thenReturn(Optional.of(premiumCourse));
        when(purchaseRepository.existsByUserIdAndCourseId(1L, 2L)).thenReturn(false);

        CoursePurchase savedPurchase = CoursePurchase.builder()
                .id(1L)
                .user(testUser)
                .course(premiumCourse)
                .purchasePrice(premiumCourse.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId("MOCK-123")
                .build();
        when(purchaseRepository.save(any(CoursePurchase.class))).thenReturn(savedPurchase);

        // When
        PurchaseDTO result = purchaseService.purchaseCourse("test@example.com", 2L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUserId()).isEqualTo(1L);
        assertThat(result.getCourseId()).isEqualTo(2L);
        assertThat(result.getPurchasePrice()).isEqualByComparingTo(new BigDecimal("2990.00"));
        assertThat(result.getPaymentStatus()).isEqualTo("COMPLETED");
        assertThat(result.getTransactionId()).startsWith("MOCK-");

        verify(purchaseRepository).save(any(CoursePurchase.class));
    }

    @Test
    void shouldThrowExceptionWhenPurchasingAlreadyPurchasedCourse() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(2L)).thenReturn(Optional.of(premiumCourse));
        when(purchaseRepository.existsByUserIdAndCourseId(1L, 2L)).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> purchaseService.purchaseCourse("test@example.com", 2L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Course already purchased");

        verify(purchaseRepository, never()).save(any());
    }

    @Test
    void shouldThrowExceptionWhenPurchasingFreeCourse() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(freeCourse));
        when(purchaseRepository.existsByUserIdAndCourseId(1L, 1L)).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> purchaseService.purchaseCourse("test@example.com", 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Cannot purchase free course");

        verify(purchaseRepository, never()).save(any());
    }

    @Test
    void shouldThrowExceptionWhenUserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> purchaseService.purchaseCourse("nonexistent@example.com", 2L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
    }

    @Test
    void shouldThrowExceptionWhenCourseNotFound() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(courseRepository.findById(999L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> purchaseService.purchaseCourse("test@example.com", 999L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Course not found");
    }

    @Test
    void shouldCheckIfUserHasPurchasedCourse() {
        // Given
        when(purchaseRepository.existsByUserIdAndCourseId(1L, 2L)).thenReturn(true);

        // When
        boolean result = purchaseService.hasPurchased(1L, 2L);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    void shouldReturnTrueForAccessToFreeCourse() {
        // Given
        when(courseRepository.findById(1L)).thenReturn(Optional.of(freeCourse));

        // When
        boolean hasAccess = purchaseService.hasAccess(1L, 1L);

        // Then
        assertThat(hasAccess).isTrue();
        verify(purchaseRepository, never()).existsByUserIdAndCourseId(any(), any());
    }

    @Test
    void shouldReturnTrueForAccessToPurchasedPremiumCourse() {
        // Given
        when(courseRepository.findById(2L)).thenReturn(Optional.of(premiumCourse));
        when(purchaseRepository.existsByUserIdAndCourseId(1L, 2L)).thenReturn(true);

        // When
        boolean hasAccess = purchaseService.hasAccess(1L, 2L);

        // Then
        assertThat(hasAccess).isTrue();
    }

    @Test
    void shouldReturnFalseForAccessToUnpurchasedPremiumCourse() {
        // Given
        when(courseRepository.findById(2L)).thenReturn(Optional.of(premiumCourse));
        when(purchaseRepository.existsByUserIdAndCourseId(1L, 2L)).thenReturn(false);

        // When
        boolean hasAccess = purchaseService.hasAccess(1L, 2L);

        // Then
        assertThat(hasAccess).isFalse();
    }

    @Test
    void shouldGetMyPurchases() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        CoursePurchase purchase1 = CoursePurchase.builder()
                .id(1L)
                .user(testUser)
                .course(premiumCourse)
                .purchasePrice(new BigDecimal("2990.00"))
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId("MOCK-1")
                .build();

        Course anotherCourse = Course.builder()
                .id(3L)
                .title("Another Premium Course")
                .isPremium(true)
                .price(new BigDecimal("3990.00"))
                .build();

        CoursePurchase purchase2 = CoursePurchase.builder()
                .id(2L)
                .user(testUser)
                .course(anotherCourse)
                .purchasePrice(new BigDecimal("3990.00"))
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId("MOCK-2")
                .build();

        when(purchaseRepository.findByUserId(1L)).thenReturn(Arrays.asList(purchase1, purchase2));

        // When
        List<PurchaseDTO> purchases = purchaseService.getMyPurchases("test@example.com");

        // Then
        assertThat(purchases).hasSize(2);
        assertThat(purchases)
                .extracting(PurchaseDTO::getCourseId)
                .containsExactlyInAnyOrder(2L, 3L);
        assertThat(purchases)
                .extracting(PurchaseDTO::getTransactionId)
                .containsExactlyInAnyOrder("MOCK-1", "MOCK-2");
    }

    @Test
    void shouldGetSpecificPurchase() {
        // Given
        CoursePurchase purchase = CoursePurchase.builder()
                .id(1L)
                .user(testUser)
                .course(premiumCourse)
                .purchasePrice(new BigDecimal("2990.00"))
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId("MOCK-123")
                .build();

        when(purchaseRepository.findByUserIdAndCourseId(1L, 2L)).thenReturn(Optional.of(purchase));

        // When
        PurchaseDTO result = purchaseService.getPurchase(1L, 2L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCourseId()).isEqualTo(2L);
        assertThat(result.getTransactionId()).isEqualTo("MOCK-123");
    }

    @Test
    void shouldReturnNullWhenPurchaseNotFound() {
        // Given
        when(purchaseRepository.findByUserIdAndCourseId(1L, 2L)).thenReturn(Optional.empty());

        // When
        PurchaseDTO result = purchaseService.getPurchase(1L, 2L);

        // Then
        assertThat(result).isNull();
    }
}
