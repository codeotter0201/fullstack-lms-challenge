# 購買流程實作 TODO - Release 1

## 設計決策摘要

- ✅ **多角色系統**: 建立 `user_roles` 表,支援一個用戶多個角色 (FREE/PAID/ADMIN/TEACHER)
- ✅ **購買不自動升級角色**: 購買僅記錄在 `course_purchases`,角色由管理員手動控制
- ✅ **價格存 courses 表**: 新增 `price` 欄位到 courses 表
- ✅ **存取權限**: 純粹檢查 `course_purchases` 表,不依賴用戶角色
- ✅ **防重複購買**: 使用 UNIQUE 約束 (user_id, course_id)

---

## Phase 1: 資料庫設計與 Migration

### Task 1.1: 建立 Migration V3 - 新增資料表
**檔案**: `backend/src/main/resources/db/migration/V3__add_purchase_and_role_tables.sql`

```sql
-- 1. 建立 user_roles 表
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    granted_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_role
        UNIQUE (user_id, role),
    CONSTRAINT chk_role
        CHECK (role IN ('FREE', 'PAID', 'ADMIN', 'TEACHER'))
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- 2. 建立 course_purchases 表
CREATE TABLE course_purchases (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchases_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_purchases_course
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_course_purchase
        UNIQUE (user_id, course_id),
    CONSTRAINT chk_payment_status
        CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'))
);

CREATE INDEX idx_purchases_user_id ON course_purchases(user_id);
CREATE INDEX idx_purchases_course_id ON course_purchases(course_id);
CREATE INDEX idx_purchases_date ON course_purchases(purchase_date DESC);

-- 3. 修改 courses 表 - 新增 price 欄位
ALTER TABLE courses ADD COLUMN price DECIMAL(10,2) DEFAULT 0 NOT NULL;

-- 4. 遷移現有資料: users.role -> user_roles
INSERT INTO user_roles (user_id, role, granted_at, created_at, updated_at)
SELECT id, role, created_at, created_at, updated_at FROM users;

-- 5. 為 is_premium=true 的用戶額外新增 PAID 角色
INSERT INTO user_roles (user_id, role, granted_at, created_at, updated_at)
SELECT id, 'PAID', updated_at, NOW(), NOW()
FROM users WHERE is_premium = true
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. 為沒有角色的用戶新增 FREE 角色
INSERT INTO user_roles (user_id, role, granted_at, created_at, updated_at)
SELECT id, 'FREE', created_at, NOW(), NOW()
FROM users
WHERE id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id, role) DO NOTHING;
```

**驗收標準**:
- [ ] Migration 腳本執行成功
- [ ] `user_roles` 表建立完成,包含所有索引和約束
- [ ] `course_purchases` 表建立完成,包含所有索引和約束
- [ ] `courses.price` 欄位新增成功
- [ ] 現有用戶資料成功遷移到 `user_roles` 表

---

## Phase 2: Entity 層實作

### Task 2.1: 建立 UserRole Entity
**檔案**: `backend/src/main/java/com/waterball/lms/entity/UserRole.java`

```java
package com.waterball.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRole extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRoleType role;

    @Column(name = "granted_at", nullable = false)
    private LocalDateTime grantedAt;

    public enum UserRoleType {
        FREE, PAID, ADMIN, TEACHER
    }
}
```

**驗收標準**:
- [ ] Entity 類別建立完成
- [ ] 包含所有必要欄位
- [ ] 使用 Lombok 註解減少樣板代碼
- [ ] 繼承 BaseEntity (包含 createdAt, updatedAt)

### Task 2.2: 建立 CoursePurchase Entity
**檔案**: `backend/src/main/java/com/waterball/lms/entity/CoursePurchase.java`

```java
package com.waterball.lms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @Column(name = "purchase_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "purchase_date", nullable = false)
    private LocalDateTime purchaseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}
```

**驗收標準**:
- [ ] Entity 類別建立完成
- [ ] BigDecimal 用於價格欄位
- [ ] PaymentStatus 枚舉定義完整
- [ ] 關聯關係正確設定 (ManyToOne)

### Task 2.3: 修改 Course Entity - 新增 price 欄位
**檔案**: `backend/src/main/java/com/waterball/lms/entity/Course.java`

```java
// 新增欄位
@Column(precision = 10, scale = 2, nullable = false)
private BigDecimal price = BigDecimal.ZERO;
```

**驗收標準**:
- [ ] Course entity 新增 price 欄位
- [ ] 預設值為 BigDecimal.ZERO
- [ ] Getter/Setter 方法存在

---

## Phase 3: Repository 層實作

### Task 3.1: 建立 UserRoleRepository
**檔案**: `backend/src/main/java/com/waterball/lms/repository/UserRoleRepository.java`

```java
package com.waterball.lms.repository;

import com.waterball.lms.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUserId(Long userId);
    boolean existsByUserIdAndRole(Long userId, UserRole.UserRoleType role);
    void deleteByUserIdAndRole(Long userId, UserRole.UserRoleType role);
}
```

**單元測試**: `UserRoleRepositoryTest.java`
- [ ] 測試 `findByUserId()` - 查詢用戶的所有角色
- [ ] 測試 `existsByUserIdAndRole()` - 檢查用戶是否有特定角色
- [ ] 測試多角色場景 - 一個用戶同時有 STUDENT 和 PAID

### Task 3.2: 建立 CoursePurchaseRepository
**檔案**: `backend/src/main/java/com/waterball/lms/repository/CoursePurchaseRepository.java`

```java
package com.waterball.lms.repository;

import com.waterball.lms.entity.CoursePurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoursePurchaseRepository extends JpaRepository<CoursePurchase, Long> {
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    List<CoursePurchase> findByUserId(Long userId);
    Optional<CoursePurchase> findByUserIdAndCourseId(Long userId, Long courseId);
    List<CoursePurchase> findByCourseId(Long courseId);
}
```

**單元測試**: `CoursePurchaseRepositoryTest.java`
- [ ] 測試 `existsByUserIdAndCourseId()` - 檢查是否已購買
- [ ] 測試 `findByUserId()` - 查詢用戶的所有購買記錄
- [ ] 測試 `findByUserIdAndCourseId()` - 查詢特定購買記錄
- [ ] 測試 UNIQUE 約束 - 重複購買應該失敗

---

## Phase 4: DTO 層實作

### Task 4.1: 建立 PurchaseDTO
**檔案**: `backend/src/main/java/com/waterball/lms/dto/PurchaseDTO.java`

```java
package com.waterball.lms.dto;

import com.waterball.lms.entity.CoursePurchase;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
```

### Task 4.2: 建立 PurchaseRequest
**檔案**: `backend/src/main/java/com/waterball/lms/dto/PurchaseRequest.java`

```java
package com.waterball.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequest {
    // 目前為 MVP,未來可擴充付款資訊
    // private String paymentMethod;
    // private String paymentToken;
}
```

### Task 4.3: 建立 UserRoleDTO
**檔案**: `backend/src/main/java/com/waterball/lms/dto/UserRoleDTO.java`

```java
package com.waterball.lms.dto;

import com.waterball.lms.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleDTO {
    private Long id;
    private String role;
    private LocalDateTime grantedAt;

    public static UserRoleDTO from(UserRole userRole) {
        return UserRoleDTO.builder()
                .id(userRole.getId())
                .role(userRole.getRole().name())
                .grantedAt(userRole.getGrantedAt())
                .build();
    }
}
```

**驗收標準**:
- [ ] 所有 DTO 類別建立完成
- [ ] 包含靜態 `from()` 方法用於轉換
- [ ] 使用 Lombok 減少樣板代碼

---

## Phase 5: Service 層實作

### Task 5.1: 建立 PurchaseService
**檔案**: `backend/src/main/java/com/waterball/lms/service/PurchaseService.java`

```java
package com.waterball.lms.service;

import com.waterball.lms.dto.PurchaseDTO;
import com.waterball.lms.entity.Course;
import com.waterball.lms.entity.CoursePurchase;
import com.waterball.lms.entity.User;
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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseService {
    private final CoursePurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    /**
     * 購買課程 (模擬付款)
     */
    @Transactional
    public PurchaseDTO purchaseCourse(String userEmail, Long courseId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // 1. 檢查是否已購買
        if (purchaseRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new IllegalStateException("Course already purchased");
        }

        // 2. 檢查課程是否為付費課程
        if (!course.getIsPremium()) {
            throw new IllegalArgumentException("Cannot purchase free course");
        }

        // 3. 建立購買記錄
        CoursePurchase purchase = CoursePurchase.builder()
                .user(user)
                .course(course)
                .purchasePrice(course.getPrice())
                .purchaseDate(LocalDateTime.now())
                .paymentStatus(CoursePurchase.PaymentStatus.COMPLETED)
                .transactionId("MOCK-" + UUID.randomUUID().toString())
                .build();

        purchase = purchaseRepository.save(purchase);

        return PurchaseDTO.from(purchase);
    }

    /**
     * 檢查用戶是否已購買課程
     */
    public boolean hasPurchased(Long userId, Long courseId) {
        return purchaseRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    /**
     * 檢查用戶是否有存取權限
     * 規則: 免費課程 OR 已購買
     */
    public boolean hasAccess(Long userId, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // 免費課程直接允許
        if (!course.getIsPremium()) {
            return true;
        }

        // 付費課程檢查購買記錄
        return hasPurchased(userId, courseId);
    }

    /**
     * 取得用戶的所有購買記錄
     */
    public List<PurchaseDTO> getMyPurchases(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return purchaseRepository.findByUserId(user.getId()).stream()
                .map(PurchaseDTO::from)
                .collect(Collectors.toList());
    }

    /**
     * 取得特定購買記錄
     */
    public PurchaseDTO getPurchase(Long userId, Long courseId) {
        return purchaseRepository.findByUserIdAndCourseId(userId, courseId)
                .map(PurchaseDTO::from)
                .orElse(null);
    }
}
```

**單元測試**: `PurchaseServiceTest.java`
- [ ] 測試成功購買課程
- [ ] 測試重複購買應拋出異常
- [ ] 測試購買免費課程應拋出異常
- [ ] 測試 `hasPurchased()` 正確回傳
- [ ] 測試 `hasAccess()` - 免費課程
- [ ] 測試 `hasAccess()` - 已購買付費課程
- [ ] 測試 `hasAccess()` - 未購買付費課程
- [ ] 測試 `getMyPurchases()` 回傳正確清單
- [ ] 測試交易 ID 自動生成

### Task 5.2: 修改 CourseService - 更新存取控制
**檔案**: `backend/src/main/java/com/waterball/lms/service/CourseService.java`

修改所有課程存取相關方法:

```java
// 注入 PurchaseService
private final PurchaseService purchaseService;

// 修改 getCourseById 方法
public CourseDTO getCourseById(String email, Long id) {
    User user = getUserByEmail(email);
    Course course = courseRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Course not found"));

    // 替換原本的 isPremium 檢查
    if (!purchaseService.hasAccess(user.getId(), id)) {
        throw new IllegalArgumentException("Course requires purchase");
    }

    return CourseDTO.from(course);
}

// 同樣修改 getLessonsByCourseId 等方法
```

**單元測試**: `CourseServiceTest.java` (更新)
- [ ] 測試免費課程存取
- [ ] 測試已購買付費課程存取
- [ ] 測試未購買付費課程應拋出異常

---

## Phase 6: Controller 層實作

### Task 6.1: 建立 PurchaseController
**檔案**: `backend/src/main/java/com/waterball/lms/controller/PurchaseController.java`

```java
package com.waterball.lms.controller;

import com.waterball.lms.dto.PurchaseDTO;
import com.waterball.lms.dto.PurchaseRequest;
import com.waterball.lms.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {
    private final PurchaseService purchaseService;

    /**
     * 購買課程
     */
    @PostMapping("/courses/{courseId}")
    public ResponseEntity<PurchaseDTO> purchaseCourse(
            @PathVariable Long courseId,
            @RequestBody(required = false) PurchaseRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        PurchaseDTO purchase = purchaseService.purchaseCourse(email, courseId);
        return ResponseEntity.ok(purchase);
    }

    /**
     * 取得我的購買記錄
     */
    @GetMapping("/my-purchases")
    public ResponseEntity<List<PurchaseDTO>> getMyPurchases(
            Authentication authentication) {
        String email = authentication.getName();
        List<PurchaseDTO> purchases = purchaseService.getMyPurchases(email);
        return ResponseEntity.ok(purchases);
    }

    /**
     * 檢查是否已購買特定課程
     */
    @GetMapping("/check/{courseId}")
    public ResponseEntity<Map<String, Boolean>> checkPurchase(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication.getName();
        // 需要先取得 user
        // 簡化版: 直接用 service 查詢
        boolean purchased = purchaseService.hasPurchased(
            userRepository.findByEmail(email).get().getId(),
            courseId
        );
        return ResponseEntity.ok(Map.of("purchased", purchased));
    }
}
```

**整合測試**: `PurchaseControllerTest.java`
- [ ] 測試 `POST /api/purchases/courses/{id}` - 成功購買
- [ ] 測試重複購買回傳 400
- [ ] 測試未登入回傳 401
- [ ] 測試 `GET /api/purchases/my-purchases` - 回傳購買清單
- [ ] 測試 `GET /api/purchases/check/{id}` - 檢查購買狀態

### Task 6.2: 更新 SecurityConfig
**檔案**: `backend/src/main/java/com/waterball/lms/config/SecurityConfig.java`

```java
// 新增購買相關端點到安全配置
.requestMatchers("/api/purchases/**").authenticated()
```

**驗收標準**:
- [ ] 購買端點需要認證
- [ ] 未認證請求回傳 401

---

## Phase 7: 異常處理

### Task 7.1: 建立自訂異常
**檔案**: `backend/src/main/java/com/waterball/lms/exception/DuplicatePurchaseException.java`

```java
package com.waterball.lms.exception;

public class DuplicatePurchaseException extends RuntimeException {
    public DuplicatePurchaseException(String message) {
        super(message);
    }
}
```

### Task 7.2: 更新 GlobalExceptionHandler
**檔案**: `backend/src/main/java/com/waterball/lms/exception/GlobalExceptionHandler.java`

```java
@ExceptionHandler(DuplicatePurchaseException.class)
public ResponseEntity<ErrorResponse> handleDuplicatePurchase(
        DuplicatePurchaseException ex) {
    return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(ex.getMessage()));
}
```

**驗收標準**:
- [ ] 重複購買回傳 409 Conflict
- [ ] 錯誤訊息清楚明確

---

## Phase 8: 測試資料準備

### Task 8.1: 更新 V2 Migration - 新增測試課程價格
**檔案**: `backend/src/main/resources/db/migration/V2__insert_initial_data.sql`

```sql
-- 更新課程價格
UPDATE courses SET price = 2990.00 WHERE id = 1; -- Java 入門
UPDATE courses SET price = 3990.00 WHERE id = 2; -- Spring Boot 實戰
UPDATE courses SET price = 4990.00 WHERE id = 3; -- 微服務架構
-- 免費課程維持 0
```

**驗收標準**:
- [ ] 測試資料包含不同價格的課程
- [ ] 免費課程價格為 0

---

## Phase 9: 前端整合 (簡要說明)

### Task 9.1: 課程頁面顯示購買按鈕
**檔案**: `frontend/components/course/CoursePurchaseButton.tsx`

功能:
- 呼叫 `GET /api/purchases/check/{id}` 檢查購買狀態
- 顯示「購買課程 NT$ {price}」或「開始學習」

### Task 9.2: 購買確認彈窗
**檔案**: `frontend/components/course/PurchaseConfirmModal.tsx`

功能:
- 顯示課程資訊、價格
- 呼叫 `POST /api/purchases/courses/{id}` 執行購買
- 顯示成功/失敗訊息

### Task 9.3: 我的購買記錄頁面
**檔案**: `frontend/app/my-purchases/page.tsx`

功能:
- 呼叫 `GET /api/purchases/my-purchases` 取得購買清單
- 顯示購買日期、課程名稱、價格

**驗收標準**:
- [ ] 購買流程完整可運行
- [ ] UI 顯示正確的購買狀態
- [ ] 錯誤處理完善 (重複購買、網路錯誤)

---

## Phase 10: E2E 測試場景

> 參考: `e2e/README.md` - E2E 測試指南與架構

### 測試檔案位置
- **測試目錄**: `e2e/tests/purchase/`
- **Page Objects**: `e2e/pages/PurchasePage.ts`, `e2e/pages/CoursePage.ts`
- **測試資料**: `e2e/fixtures/test-courses.ts` (新增價格資訊)
- **Helpers**: `e2e/helpers/purchase-helpers.ts`

### E2E 測試檔案結構

#### 檔案 1: `e2e/tests/purchase/course-purchase.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { loginAsPaidUser, loginAsFreeUser } from '../../helpers/auth-helpers';
import { CoursePage } from '../../pages/CoursePage';
import { testCourses } from '../../fixtures/test-courses';

test.describe('Course Purchase Flow @purchase', () => {
  test('should successfully purchase a course @smoke', async ({ page }) => {
    // 場景 1: 成功購買流程
    await loginAsFreeUser(page);

    const coursePage = new CoursePage(page);
    const paidCourse = testCourses.find(c => c.isPremium);
    await coursePage.goto(paidCourse.id);

    // 驗證顯示購買按鈕
    await expect(coursePage.purchaseButton).toBeVisible();
    await expect(coursePage.purchaseButton).toContainText(`NT$ ${paidCourse.price}`);

    // 點擊購買
    await coursePage.purchaseButton.click();

    // 驗證購買確認彈窗
    const modal = page.locator('[data-testid="purchase-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(paidCourse.title);
    await expect(modal).toContainText(`NT$ ${paidCourse.price}`);

    // 確認購買
    await page.locator('[data-testid="confirm-purchase-button"]').click();

    // 等待購買 API 回應
    const response = await page.waitForResponse(
      response => response.url().includes('/api/purchases/courses/')
    );
    expect(response.ok()).toBe(true);

    // 驗證購買成功訊息
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // 驗證課程解鎖,顯示「開始學習」
    await expect(coursePage.startLearningButton).toBeVisible();
    await expect(coursePage.purchaseButton).not.toBeVisible();
  });

  test('should prevent duplicate purchase @critical', async ({ page }) => {
    // 場景 2: 防止重複購買
    await loginAsFreeUser(page);

    const coursePage = new CoursePage(page);
    const paidCourse = testCourses.find(c => c.isPremium);

    // 第一次購買
    await coursePage.goto(paidCourse.id);
    await coursePage.purchaseButton.click();
    await page.locator('[data-testid="confirm-purchase-button"]').click();
    await page.waitForResponse(r => r.url().includes('/api/purchases/courses/'));

    // 重新載入頁面
    await page.reload();

    // 驗證顯示「開始學習」而非「購買」
    await expect(coursePage.startLearningButton).toBeVisible();
    await expect(coursePage.purchaseButton).not.toBeVisible();
  });

  test('should not show purchase button for free courses', async ({ page }) => {
    // 場景 3: 免費課程不可購買
    await loginAsFreeUser(page);

    const coursePage = new CoursePage(page);
    const freeCourse = testCourses.find(c => !c.isPremium);
    await coursePage.goto(freeCourse.id);

    // 驗證不顯示「購買」按鈕
    await expect(coursePage.purchaseButton).not.toBeVisible();

    // 驗證直接顯示「開始學習」
    await expect(coursePage.startLearningButton).toBeVisible();
  });
});
```

#### 檔案 2: `e2e/tests/purchase/purchase-history.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { loginAsFreeUser } from '../../helpers/auth-helpers';
import { PurchaseHistoryPage } from '../../pages/PurchaseHistoryPage';
import { CoursePage } from '../../pages/CoursePage';
import { testCourses } from '../../fixtures/test-courses';

test.describe('Purchase History @purchase', () => {
  test('should display all purchased courses', async ({ page }) => {
    // 場景 4: 購買記錄查詢
    await loginAsFreeUser(page);

    // 購買多門課程
    const paidCourses = testCourses.filter(c => c.isPremium).slice(0, 2);

    for (const course of paidCourses) {
      const coursePage = new CoursePage(page);
      await coursePage.goto(course.id);
      await coursePage.purchaseButton.click();
      await page.locator('[data-testid="confirm-purchase-button"]').click();
      await page.waitForResponse(r => r.url().includes('/api/purchases/courses/'));
    }

    // 進入「我的購買記錄」頁面
    const historyPage = new PurchaseHistoryPage(page);
    await historyPage.goto();

    // 驗證顯示所有購買記錄
    await expect(historyPage.purchaseList).toBeVisible();

    const purchaseItems = await historyPage.purchaseItems.count();
    expect(purchaseItems).toBe(paidCourses.length);

    // 驗證每筆記錄包含課程名稱、價格、日期
    for (const course of paidCourses) {
      await expect(page.locator(`text=${course.title}`)).toBeVisible();
      await expect(page.locator(`text=NT$ ${course.price}`)).toBeVisible();
    }
  });
});
```

### Page Object: `e2e/pages/CoursePage.ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class CoursePage {
  readonly page: Page;
  readonly purchaseButton: Locator;
  readonly startLearningButton: Locator;
  readonly courseTitle: Locator;
  readonly coursePrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.purchaseButton = page.locator('[data-testid="purchase-button"]');
    this.startLearningButton = page.locator('[data-testid="start-learning-button"]');
    this.courseTitle = page.locator('[data-testid="course-title"]');
    this.coursePrice = page.locator('[data-testid="course-price"]');
  }

  async goto(courseId: number) {
    await this.page.goto(`/courses/${courseId}`);
  }
}
```

### 測試資料: 更新 `e2e/fixtures/test-courses.ts`

```typescript
export const testCourses = [
  {
    id: 1,
    title: 'Java 入門課程',
    isPremium: true,
    price: 2990,
  },
  {
    id: 2,
    title: 'Spring Boot 實戰',
    isPremium: true,
    price: 3990,
  },
  {
    id: 3,
    title: '免費入門課程',
    isPremium: false,
    price: 0,
  },
];
```

### 執行測試

```bash
# 執行所有購買相關測試
npx playwright test --grep @purchase

# 執行煙霧測試
npx playwright test --grep @smoke

# 執行關鍵測試
npx playwright test --grep @critical

# 在 UI 模式下執行 (方便調試)
npx playwright test --ui
```

**驗收標準**:
- [ ] 所有購買流程 E2E 測試通過
- [ ] 測試覆蓋成功購買、重複購買防護、免費課程檢查
- [ ] 測試覆蓋購買記錄查詢
- [ ] Page Objects 正確封裝頁面互動
- [ ] 測試資料從 fixtures 載入
- [ ] 前後端整合無誤
- [ ] 測試可在 CI/CD 環境執行

---

## 完成後更新文檔清單

### 後端文檔更新
1. **backend/docs/DATABASE-SCHEMA.md**
   - 新增 `user_roles` 表結構說明
   - 新增 `course_purchases` 表結構說明
   - 更新 `courses` 表說明 (新增 price 欄位)
   - 更新 ER Diagram

2. **backend/docs/API-GUIDE.md**
   - 新增購買相關 API 端點文檔
   - 新增 Request/Response 範例
   - 新增錯誤代碼說明

3. **backend/docs/ARCHITECTURE.md**
   - 更新 Entity 清單
   - 更新 Service 層說明
   - 新增購買流程架構圖

---

## 驗收檢查清單

### 功能驗收
- [ ] 用戶可以成功購買付費課程
- [ ] 系統防止重複購買同一課程
- [ ] 購買後用戶可以立即存取課程內容
- [ ] 免費課程不顯示購買按鈕
- [ ] 用戶可以查看自己的購買記錄
- [ ] 購買記錄包含完整資訊 (課程、價格、日期、交易ID)

### 技術驗收
- [ ] 所有 Migration 成功執行
- [ ] 所有 Entity 正確映射資料表
- [ ] 所有 Repository 方法有單元測試
- [ ] 所有 Service 方法有單元測試 (覆蓋率 > 80%)
- [ ] 所有 Controller 端點有整合測試
- [ ] 異常處理完善,回傳正確的 HTTP 狀態碼
- [ ] API 遵循 RESTful 設計原則
- [ ] 程式碼遵循專案風格指南

### 文檔驗收
- [ ] 資料庫 Schema 文檔更新完成
- [ ] API 文檔更新完成,包含範例
- [ ] 架構文檔更新完成
- [ ] README 更新 (如需要)

---

## 預估工作量

- **Phase 1-2** (Database & Entity): 2-3 小時
- **Phase 3-4** (Repository & DTO): 2-3 小時
- **Phase 5** (Service): 3-4 小時
- **Phase 6-7** (Controller & Exception): 2-3 小時
- **Phase 8** (Test Data): 1 小時
- **Phase 9** (Frontend): 4-5 小時
- **Phase 10** (E2E Testing): 2-3 小時
- **Documentation**: 2 小時

**總計**: 約 18-24 小時

---

## 注意事項

1. **交易安全**: 目前為 MVP 模擬付款,未來需串接真實金流
2. **退款機制**: 目前未實作,未來需新增退款 API
3. **優惠券**: 目前未實作,未來可擴充優惠碼功能
4. **發票開立**: 目前未實作,未來需整合發票系統
5. **訂閱制**: 目前僅支援單次購買,未來可擴充訂閱方案

---

## 參考資料

- 現有 ProgressService 實作模式
- 現有 CourseController API 設計
- Spring Data JPA 文檔
- Flyway Migration 最佳實踐
