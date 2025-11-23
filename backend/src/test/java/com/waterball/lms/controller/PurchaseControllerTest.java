package com.waterball.lms.controller;

import com.waterball.lms.model.dto.PurchaseDTO;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.UserRepository;
import com.waterball.lms.service.PurchaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for PurchaseController
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PurchaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PurchaseService purchaseService;

    @MockBean
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .displayName("Test User")
                .build();
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void shouldPurchaseCourse() throws Exception {
        // Given
        PurchaseDTO purchaseDTO = PurchaseDTO.builder()
                .id(1L)
                .userId(1L)
                .courseId(1L)
                .courseTitle("Test Course")
                .purchasePrice(new BigDecimal("2990.00"))
                .purchaseDate(LocalDateTime.now())
                .paymentStatus("COMPLETED")
                .transactionId("MOCK-123")
                .build();

        when(purchaseService.purchaseCourse(eq("test@example.com"), eq(1L)))
                .thenReturn(purchaseDTO);

        // When/Then
        mockMvc.perform(post("/api/purchases/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.courseId").value(1))
                .andExpect(jsonPath("$.courseTitle").value("Test Course"))
                .andExpect(jsonPath("$.purchasePrice").value(2990.00))
                .andExpect(jsonPath("$.paymentStatus").value("COMPLETED"))
                .andExpect(jsonPath("$.transactionId").value("MOCK-123"));
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        // When/Then
        mockMvc.perform(post("/api/purchases/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void shouldReturn409WhenPurchasingAlreadyPurchasedCourse() throws Exception {
        // Given
        when(purchaseService.purchaseCourse(eq("test@example.com"), eq(1L)))
                .thenThrow(new IllegalStateException("Course already purchased"));

        // When/Then
        mockMvc.perform(post("/api/purchases/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Course already purchased"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void shouldReturn400WhenPurchasingFreeCourse() throws Exception {
        // Given
        when(purchaseService.purchaseCourse(eq("test@example.com"), eq(1L)))
                .thenThrow(new IllegalArgumentException("Cannot purchase free course"));

        // When/Then
        mockMvc.perform(post("/api/purchases/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cannot purchase free course"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void shouldGetMyPurchases() throws Exception {
        // Given
        List<PurchaseDTO> purchases = Arrays.asList(
                PurchaseDTO.builder()
                        .id(1L)
                        .userId(1L)
                        .courseId(1L)
                        .courseTitle("Course 1")
                        .purchasePrice(new BigDecimal("2990.00"))
                        .purchaseDate(LocalDateTime.now())
                        .paymentStatus("COMPLETED")
                        .transactionId("MOCK-1")
                        .build(),
                PurchaseDTO.builder()
                        .id(2L)
                        .userId(1L)
                        .courseId(2L)
                        .courseTitle("Course 2")
                        .purchasePrice(new BigDecimal("3990.00"))
                        .purchaseDate(LocalDateTime.now())
                        .paymentStatus("COMPLETED")
                        .transactionId("MOCK-2")
                        .build()
        );

        when(purchaseService.getMyPurchases(eq("test@example.com")))
                .thenReturn(purchases);

        // When/Then
        mockMvc.perform(get("/api/purchases/my-purchases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].courseTitle").value("Course 1"))
                .andExpect(jsonPath("$[1].courseTitle").value("Course 2"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void shouldCheckPurchaseStatus() throws Exception {
        // Given
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));
        when(purchaseService.hasPurchased(eq(1L), eq(1L)))
                .thenReturn(true);

        // When/Then
        mockMvc.perform(get("/api/purchases/check/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.purchased").value(true));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void shouldCheckAccessPermission() throws Exception {
        // Given
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));
        when(purchaseService.hasAccess(eq(1L), eq(1L)))
                .thenReturn(true);

        // When/Then
        mockMvc.perform(get("/api/purchases/access/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasAccess").value(true));
    }
}
