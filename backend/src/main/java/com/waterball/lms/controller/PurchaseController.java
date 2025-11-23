package com.waterball.lms.controller;

import com.waterball.lms.model.dto.PurchaseDTO;
import com.waterball.lms.model.dto.PurchaseRequest;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.UserRepository;
import com.waterball.lms.service.PurchaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller for course purchase operations
 */
@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
@Tag(name = "Purchase", description = "課程購買相關 API")
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final UserRepository userRepository;

    /**
     * Purchase a course
     */
    @PostMapping("/courses/{courseId}")
    @Operation(summary = "購買課程", description = "購買指定課程 (MVP: 模擬付款)")
    public ResponseEntity<PurchaseDTO> purchaseCourse(
            @PathVariable Long courseId,
            @RequestBody(required = false) PurchaseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        PurchaseDTO purchase = purchaseService.purchaseCourse(email, courseId);
        return ResponseEntity.ok(purchase);
    }

    /**
     * Get my purchase history
     */
    @GetMapping("/my-purchases")
    @Operation(summary = "我的購買記錄", description = "取得當前用戶的所有購買記錄")
    public ResponseEntity<List<PurchaseDTO>> getMyPurchases(
            Authentication authentication) {
        String email = authentication.getName();
        List<PurchaseDTO> purchases = purchaseService.getMyPurchases(email);
        return ResponseEntity.ok(purchases);
    }

    /**
     * Check if user has purchased a specific course
     */
    @GetMapping("/check/{courseId}")
    @Operation(summary = "檢查購買狀態", description = "檢查是否已購買指定課程")
    public ResponseEntity<Map<String, Boolean>> checkPurchase(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean purchased = purchaseService.hasPurchased(user.getId(), courseId);
        return ResponseEntity.ok(Map.of("purchased", purchased));
    }

    /**
     * Check if user has access to a course
     */
    @GetMapping("/access/{courseId}")
    @Operation(summary = "檢查存取權限", description = "檢查是否可存取指定課程 (免費課程或已購買)")
    public ResponseEntity<Map<String, Boolean>> checkAccess(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean hasAccess = purchaseService.hasAccess(user.getId(), courseId);
        return ResponseEntity.ok(Map.of("hasAccess", hasAccess));
    }
}
