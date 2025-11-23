package com.waterball.lms.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * CoursePurchase entity represents a course purchase record.
 * Prevents duplicate purchases through unique constraint on (user_id, course_id).
 */
@Entity
@Table(name = "course_purchases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoursePurchase extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * Price at time of purchase (may differ from current course price)
     */
    @Column(name = "purchase_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "purchase_date", nullable = false)
    private LocalDateTime purchaseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus;

    /**
     * External payment gateway transaction ID
     */
    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    /**
     * Payment status types
     */
    public enum PaymentStatus {
        PENDING,    // Payment is being processed
        COMPLETED,  // Payment successful
        FAILED,     // Payment failed
        REFUNDED    // Payment was refunded
    }

    @PrePersist
    protected void onPrePersist() {
        if (purchaseDate == null) {
            purchaseDate = LocalDateTime.now();
        }
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.COMPLETED;
        }
    }
}
