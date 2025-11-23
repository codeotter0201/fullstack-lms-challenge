package com.waterball.lms.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for purchasing a course
 * Currently empty for MVP (mock payment)
 * Future: Add payment method, payment token, etc.
 */
@Data
@NoArgsConstructor
public class PurchaseRequest {
    // For MVP: No additional fields needed (mock payment)
    // Future extensions:
    // private String paymentMethod;
    // private String paymentToken;
    // private String couponCode;
}
