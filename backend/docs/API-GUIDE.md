# API 開發指南

## API 設計規範

### RESTful 路由設計

```
GET    /api/resources          # 列表
GET    /api/resources/{id}     # 詳情
POST   /api/resources          # 創建
PUT    /api/resources/{id}     # 更新
DELETE /api/resources/{id}     # 刪除
```

### 響應格式

#### 成功響應
```json
{
  "id": 1,
  "name": "Resource Name",
  "createdAt": "2025-11-22T12:00:00"
}
```

#### 錯誤響應 (統一格式)
```json
{
  "timestamp": "2025-11-22T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "詳細錯誤訊息",
  "path": "/api/resources"
}
```

## 現有 API 列表

### 認證 API (無需 Token)

#### POST /api/auth/register
註冊新用戶

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "用戶名稱"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "displayName": "用戶名稱",
    "role": "STUDENT",
    "level": 1,
    "experience": 0,
    "isPremium": false
  }
}
```

#### POST /api/auth/login
用戶登入

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** 同註冊響應

#### GET /api/auth/me
取得當前用戶資訊 (需要 Token)

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "displayName": "用戶名稱",
  "role": "STUDENT",
  "level": 1,
  "experience": 200,
  "isPremium": false
}
```

### 課程 API (需要 Token)

#### GET /api/courses
取得課程列表 (根據用戶權限過濾)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Java 基礎入門",
    "description": "從零開始學習 Java",
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "isPremium": false,
    "totalLessons": 3,
    "displayOrder": 1
  }
]
```

#### GET /api/courses/{courseId}/lessons
取得課程的所有單元

**Response:**
```json
[
  {
    "id": 1,
    "courseId": 1,
    "title": "Java 環境安裝",
    "description": "學習如何安裝 JDK",
    "type": "VIDEO",
    "videoUrl": "https://www.youtube.com/watch?v=xxx",
    "videoDuration": 600,
    "displayOrder": 1,
    "experienceReward": 200,
    "progressPercentage": 0,
    "lastPosition": 0,
    "isCompleted": false,
    "isSubmitted": false
  }
]
```

#### GET /api/courses/lessons/{lessonId}
取得單元詳情

**Response:** 同單元對象格式

### 進度 API (需要 Token)

#### POST /api/progress/update
更新學習進度 (每 10 秒調用)

**Request:**
```json
{
  "lessonId": 1,
  "position": 300,
  "duration": 600
}
```

**Response:**
```json
{
  "lessonId": 1,
  "progressPercentage": 50,
  "lastPosition": 300,
  "isCompleted": false,
  "isSubmitted": false
}
```

#### POST /api/progress/submit
交付單元 (獲得經驗值)

**Request:**
```json
{
  "lessonId": 1
}
```

**Response:**
```json
{
  "lessonId": 1,
  "isSubmitted": true,
  "experienceGained": 200,
  "user": {
    "id": 1,
    "level": 1,
    "experience": 200,
    ...
  }
}
```

## 添加新 API 的步驟

### 1. 定義 DTO

**Request DTO** (src/main/java/com/waterball/lms/model/dto/)
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateResourceRequest {
    @NotBlank(message = "名稱不能為空")
    private String name;

    @Min(value = 0, message = "數量不能為負數")
    private Integer quantity;
}
```

**Response DTO**
```java
@Data
@Builder
public class ResourceDTO {
    private Long id;
    private String name;
    private Integer quantity;
    private LocalDateTime createdAt;

    public static ResourceDTO from(Resource entity) {
        return ResourceDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .quantity(entity.getQuantity())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
```

### 2. 創建 Controller

```java
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@Tag(name = "Resource", description = "資源管理 API")
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    @Operation(summary = "取得資源列表")
    public ResponseEntity<List<ResourceDTO>> getResources(
            Authentication authentication) {
        String email = authentication.getName();
        List<ResourceDTO> resources = resourceService.getResources(email);
        return ResponseEntity.ok(resources);
    }

    @PostMapping
    @Operation(summary = "創建資源")
    public ResponseEntity<ResourceDTO> createResource(
            @Valid @RequestBody CreateResourceRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        ResourceDTO resource = resourceService.createResource(email, request);
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/{id}")
    @Operation(summary = "取得資源詳情")
    public ResponseEntity<ResourceDTO> getResource(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        ResourceDTO resource = resourceService.getResource(email, id);
        return ResponseEntity.ok(resource);
    }
}
```

### 3. 實現 Service

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public List<ResourceDTO> getResources(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return resourceRepository.findByUserId(user.getId()).stream()
                .map(ResourceDTO::from)
                .toList();
    }

    @Transactional
    public ResourceDTO createResource(String email, CreateResourceRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Resource resource = Resource.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .user(user)
                .build();

        resource = resourceRepository.save(resource);
        return ResourceDTO.from(resource);
    }

    public ResourceDTO getResource(String email, Long resourceId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found"));

        // 權限檢查
        if (!resource.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("No permission");
        }

        return ResourceDTO.from(resource);
    }
}
```

### 4. 創建 Repository

```java
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByUserId(Long userId);
}
```

## 錯誤處理

### 使用全局異常處理

所有 Service 拋出的異常都會被 `GlobalExceptionHandler` 捕獲:

```java
// Service 中拋出異常
throw new IllegalArgumentException("User not found");

// 自動轉換為統一錯誤響應
{
  "timestamp": "2025-11-22T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "User not found",
  "path": "/api/resources"
}
```

### 添加自定義異常

1. 創建異常類:
```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

2. 在 GlobalExceptionHandler 添加處理:
```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex, HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error(HttpStatus.NOT_FOUND.getReasonPhrase())
            .message(ex.getMessage())
            .path(request.getRequestURI())
            .build();
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
}
```

## 測試 API

### 使用 curl

```bash
# 1. 登入取得 Token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# 2. 使用 Token 調用 API
curl -X GET http://localhost:8080/api/resources \
  -H "Authorization: Bearer $TOKEN"
```

### 使用 Swagger UI

1. 訪問 http://localhost:8080/swagger-ui.html
2. 使用認證 API 獲取 Token
3. 點擊 "Authorize" 輸入 Token
4. 測試其他 API

## 最佳實踐

### 1. 參數驗證

使用 `@Valid` 和 Bean Validation:
```java
@PostMapping
public ResponseEntity<?> create(@Valid @RequestBody Request request) {
    // request 已自動驗證
}
```

### 2. 分頁查詢

```java
@GetMapping
public ResponseEntity<Page<ResourceDTO>> getResources(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ResourceDTO> resources = service.getResources(pageable);
    return ResponseEntity.ok(resources);
}
```

### 3. 權限檢查

Service 層統一檢查權限:
```java
private void checkPermission(User user, Resource resource) {
    if (!resource.getUser().getId().equals(user.getId())) {
        throw new IllegalArgumentException("No permission");
    }
}
```

### 4. DTO 轉換

使用 static factory method:
```java
public static ResourceDTO from(Resource entity) {
    return ResourceDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .build();
}
```

### 5. 事務管理

- 查詢方法: `@Transactional(readOnly = true)`
- 修改方法: `@Transactional`

```java
@Service
@Transactional(readOnly = true)  // 類級別默認只讀
public class ResourceService {

    @Transactional  // 方法級別覆蓋
    public void updateResource(Long id, Request request) {
        // 修改操作
    }
}
```

---

## 購買 API (需要認證)

### POST /api/purchases/courses/{courseId}
購買指定課程 (MVP: 模擬付款)

**需要權限:** 已登入用戶

**Path Parameters:**
- `courseId` (Long, required) - 課程 ID

**Request Body:**
```json
{}
```
*註: MVP 版本不需要任何參數,未來可擴充支付方式、優惠碼等*

**Response (200 OK):**
```json
{
  "id": 1,
  "userId": 123,
  "courseId": 456,
  "courseTitle": "Java 入門課程",
  "purchasePrice": 2990.00,
  "purchaseDate": "2025-11-23T14:30:00",
  "paymentStatus": "COMPLETED",
  "transactionId": "MOCK-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Error Responses:**
- `400 Bad Request` - 課程不存在或嘗試購買免費課程
  ```json
  {
    "timestamp": "2025-11-23T14:30:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Cannot purchase free course",
    "path": "/api/purchases/courses/1"
  }
  ```

- `409 Conflict` - 重複購買
  ```json
  {
    "timestamp": "2025-11-23T14:30:00",
    "status": 409,
    "error": "Conflict",
    "message": "Course already purchased",
    "path": "/api/purchases/courses/1"
  }
  ```

**業務規則:**
- 只能購買 `isPremium = true` 的付費課程
- 每個用戶只能購買同一課程一次
- 購買成功後立即獲得課程存取權限
- 購買不會自動升級用戶角色 (需管理員手動分配 PAID 角色)
- 交易 ID 格式: `MOCK-{UUID}`

---

### GET /api/purchases/my-purchases
取得當前用戶的所有購買記錄

**需要權限:** 已登入用戶

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 123,
    "courseId": 456,
    "courseTitle": "Java 入門課程",
    "purchasePrice": 2990.00,
    "purchaseDate": "2025-11-22T10:00:00",
    "paymentStatus": "COMPLETED",
    "transactionId": "MOCK-xxx-123"
  },
  {
    "id": 2,
    "userId": 123,
    "courseId": 789,
    "courseTitle": "Spring Boot 實戰",
    "purchasePrice": 3990.00,
    "purchaseDate": "2025-11-23T14:00:00",
    "paymentStatus": "COMPLETED",
    "transactionId": "MOCK-xxx-456"
  }
]
```

**說明:**
- 按購買時間倒序排列
- 包含完整的課程資訊和購買詳情

---

### GET /api/purchases/check/{courseId}
檢查當前用戶是否已購買指定課程

**需要權限:** 已登入用戶

**Path Parameters:**
- `courseId` (Long, required) - 課程 ID

**Response (200 OK):**
```json
{
  "purchased": true
}
```

**用途:**
- 前端顯示「購買課程」或「開始學習」按鈕
- 避免重複購買嘗試

---

### GET /api/purchases/access/{courseId}
檢查當前用戶是否可存取指定課程

**需要權限:** 已登入用戶

**Path Parameters:**
- `courseId` (Long, required) - 課程 ID

**Response (200 OK):**
```json
{
  "hasAccess": true
}
```

**存取規則:**
- 免費課程 (`isPremium = false`): 所有用戶都可存取
- 付費課程 (`isPremium = true`): 需已購買該課程

**用途:**
- 前端控制課程內容顯示
- 防止未授權存取

---

## 購買流程整體架構

### 存取控制邏輯

```
用戶存取課程
    ↓
免費課程? ──Yes──→ 允許存取
    ↓ No
已購買? ──Yes──→ 允許存取
    ↓ No
拒絕存取 (顯示購買按鈕)
```

### 購買流程

```
1. 用戶點擊「購買課程」
    ↓
2. 前端呼叫 POST /api/purchases/courses/{id}
    ↓
3. 後端檢查:
   - 課程是否為付費課程?
   - 是否已購買? (防重複)
    ↓
4. 建立購買記錄 (模擬付款成功)
    ↓
5. 回傳購買憑證
    ↓
6. 前端顯示成功訊息
    ↓
7. 用戶可立即存取課程內容
```

### 與角色系統的關係

- **購買記錄** (`course_purchases`) 和 **用戶角色** (`user_roles`) 是**分離的**
- 購買課程 **不會自動** 升級用戶角色
- 用戶角色由管理員手動管理:
  - `FREE` - 預設角色,可購買單門課程
  - `PAID` - 付費會員,由管理員分配
  - `ADMIN` - 管理員
  - `TEACHER` - 講師

### 未來擴充方向

MVP 版本使用模擬付款,未來可擴充:

1. **真實金流整合**
   - 串接第三方支付 (綠界、藍新、Stripe 等)
   - 支援信用卡、ATM 轉帳、超商代碼

2. **訂閱制度**
   - 月費/年費吃到飽方案
   - 自動續費機制

3. **優惠功能**
   - 優惠碼 / Coupon
   - 限時折扣
   - 組合優惠

4. **退款機制**
   - 退款申請流程
   - 退款原因記錄
   - 自動撤銷存取權限

5. **發票開立**
   - 電子發票整合
   - 統一編號支援
