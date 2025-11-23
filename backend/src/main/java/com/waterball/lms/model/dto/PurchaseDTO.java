package com.waterball.lms.model.dto;

import com.waterball.lms.model.entity.CoursePurchase;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for course purchase information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDTO {

    private Long id;
    private Long userId;
    private Long courseId;
    private String courseTitle;
    private BigDecimal purchasePrice;
    private LocalDateTime purchaseDate;
    private String paymentStatus;
    private String transactionId;

    /**
     * Convert CoursePurchase entity to DTO
     *
     * @param purchase CoursePurchase entity
     * @return PurchaseDTO
     */
    public static PurchaseDTO from(CoursePurchase purchase) {
        return PurchaseDTO.builder()
                .id(purchase.getId())
                .userId(purchase.getUser().getId())
                .courseId(purchase.getCourse().getId())
                .courseTitle(purchase.getCourse().getTitle())
                .purchasePrice(purchase.getPurchasePrice())
                .purchaseDate(purchase.getPurchaseDate())
                .paymentStatus(purchase.getPaymentStatus().name())
                .transactionId(purchase.getTransactionId())
                .build();
    }
}
