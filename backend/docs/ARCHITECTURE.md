# 架構設計文檔

## 系統架構

### 技術棧

```
┌─────────────────────────────────────┐
│         Frontend (未實現)            │
│    React / Next.js / TypeScript     │
└─────────────┬───────────────────────┘
              │ REST API / JWT
┌─────────────▼───────────────────────┐
│           Backend (Spring Boot)     │
│  ┌─────────────────────────────┐   │
│  │      Controller Layer       │   │
│  └────────────┬────────────────┘   │
│  ┌────────────▼────────────────┐   │
│  │       Service Layer         │   │
│  └────────────┬────────────────┘   │
│  ┌────────────▼────────────────┐   │
│  │     Repository Layer        │   │
│  └────────────┬────────────────┘   │
└───────────────┼─────────────────────┘
                │ JPA
┌───────────────▼─────────────────────┐
│       PostgreSQL Database           │
└─────────────────────────────────────┘
```

### 分層架構

#### Controller Layer (控制器層)
- 職責: 接收 HTTP 請求、參數驗證、響應格式化
- 位置: `com.waterball.lms.controller`
- 特點:
  - 使用 `@RestController` 註解
  - 參數使用 `@Valid` 自動驗證
  - 從 `Authentication` 取得當前用戶
  - 不包含業務邏輯

#### Service Layer (服務層)
- 職責: 業務邏輯實現、事務管理、權限控制
- 位置: `com.waterball.lms.service`
- 特點:
  - 使用 `@Service` 註解
  - 類級別 `@Transactional(readOnly = true)`
  - 修改方法使用 `@Transactional`
  - 包含所有業務規則

#### Repository Layer (數據訪問層)
- 職責: 數據庫 CRUD 操作
- 位置: `com.waterball.lms.repository`
- 特點:
  - 繼承 `JpaRepository<Entity, ID>`
  - 使用 Query Methods 或 `@Query`
  - 不包含業務邏輯

## 核心模組

### 認證系統 (Authentication)

**組件:**
- `AuthController`: 註冊、登入、取得用戶資訊
- `AuthService`: 用戶認證業務邏輯
- `JwtTokenProvider`: JWT Token 生成與驗證
- `JwtAuthenticationFilter`: 請求攔截與 Token 驗證

**流程:**
```
1. 用戶登入
   POST /api/auth/login
   → AuthController.login()
   → AuthService.login()
      → 驗證密碼 (BCrypt)
      → 生成 JWT Token
   → 返回 Token + UserDTO

2. 攜帶 Token 訪問 API
   GET /api/courses
   Header: Authorization: Bearer <token>
   → JwtAuthenticationFilter.doFilterInternal()
      → 提取 Token
      → 驗證 Token (JwtTokenProvider)
      → 設置 SecurityContext
   → CourseController.getCourses()
      → 從 Authentication 取得 email
```

### 課程系統 (Course)

**組件:**
- `CourseController`: 課程與單元 API (公開 GET 端點)
- `CourseService`: 課程業務邏輯與影片內容保護
- `PurchaseService`: 購買記錄與存取權限檢查
- `Course` & `Lesson` Entity

**公開 API 設計:**
```java
// 課程列表 - 公開 API (無需認證)
public List<CourseDTO> getAllCourses(String userEmail) {
    // userEmail 可能為 null (訪客)
    // 所有已發布的課程都顯示，不過濾
    return courseRepository.findAllByIsPublishedTrueOrderByDisplayOrder()
        .stream()
        .map(CourseDTO::from)
        .toList();
}

// 課程單元 - 公開 API，但影片 URL 有條件保護
public List<LessonDTO> getCourseLessons(Long courseId, String userEmail) {
    // 檢查存取權限
    boolean hasAccess = false;
    if (userEmail != null) {
        User user = getUserByEmail(userEmail);
        // 免費課程 OR 已購買付費課程
        hasAccess = purchaseService.hasAccess(user.getId(), courseId);
    }

    // 根據存取權限決定是否返回影片 URL
    return lessons.stream()
        .map(lesson -> LessonDTO.from(lesson, hasAccess))
        .toList();
}
```

**存取權限邏輯:**
```java
// PurchaseService.hasAccess()
public boolean hasAccess(Long userId, Long courseId) {
    Course course = courseRepository.findById(courseId).orElseThrow();

    // 免費課程: 所有人都可以存取
    if (!course.getIsPremium()) {
        return true;
    }

    // 付費課程: 檢查購買記錄
    return purchaseRepository.existsByUserIdAndCourseId(userId, courseId);
}
```

### 進度系統 (Progress)

**組件:**
- `ProgressController`: 進度更新與交付 API
- `ProgressService`: 進度追蹤業務邏輯
- `Progress` Entity

**業務邏輯:**

1. **進度更新** (每 10 秒調用)
```java
public Map<String, Object> updateProgress(String email, ProgressUpdateRequest request) {
    User user = getUserByEmail(email);
    Lesson lesson = lessonRepository.findById(request.getLessonId())
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

    // 取得或建立進度記錄
    Progress progress = progressRepository
            .findByUserIdAndLessonId(user.getId(), lesson.getId())
            .orElse(Progress.builder()
                    .user(user)
                    .lesson(lesson)
                    .build());

    // 更新進度
    progress.updateProgress(request.getPosition(), request.getDuration());
    progressRepository.save(progress);

    return buildProgressResponse(progress);
}
```

2. **交付單元** (獲得經驗值)
```java
@Transactional
public Map<String, Object> submitLesson(String email, ProgressSubmitRequest request) {
    User user = getUserByEmail(email);
    Progress progress = getProgressByUserAndLesson(user.getId(), request.getLessonId());

    // 驗證: 必須完成 + 未交付
    if (!progress.getIsCompleted()) {
        throw new IllegalStateException("Lesson not completed yet");
    }
    if (progress.getIsSubmitted()) {
        throw new IllegalStateException("Lesson already submitted");
    }

    // 發放經驗值
    int experience = progress.getLesson().getExperienceReward();
    progress.setIsSubmitted(true);
    progress.setExperienceGained(experience);
    progressRepository.save(progress);

    // 更新用戶經驗值與等級
    UserDTO updatedUser = experienceService.addExperience(user, experience);

    return buildSubmitResponse(progress, updatedUser);
}
```

### 經驗系統 (Experience)

**組件:**
- `ExperienceService`: 經驗值與等級計算

**等級計算公式:**
```java
public int calculateLevel(int experience) {
    // 1000 EXP = 1 級
    // Level 1: 0-999 EXP
    // Level 2: 1000-1999 EXP
    // Level 3: 2000-2999 EXP
    return Math.max(1, (experience / 1000) + 1);
}
```

**經驗值發放:**
```java
@Transactional
public UserDTO addExperience(User user, int experience) {
    int newExp = user.getExperience() + experience;
    user.setExperience(newExp);

    // 計算新等級
    int newLevel = calculateLevel(newExp);
    if (newLevel > user.getLevel()) {
        user.setLevel(newLevel);
        // 可在此處觸發升級事件
    }

    userRepository.save(user);
    return UserDTO.from(user);
}
```

## 安全機制

### JWT 認證

**Token 結構:**
```json
{
  "sub": "user@example.com",
  "role": "STUDENT",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Token 配置:**
- 算法: HS512
- 有效期: 24 小時
- Secret Key: 256 bits (配置於 application.yml)

### 權限控制

**端點權限:**
```java
// SecurityConfig.java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers(
        "/api/health",
        "/api/auth/**",
        "/swagger-ui/**",
        "/v3/api-docs/**"
    ).permitAll()
    // 課程相關 API 公開 (GET only)
    .requestMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
    .anyRequest().authenticated()
);
```

**重點說明:**
- **公開 API**: `GET /api/courses/**` 所有人都可以存取 (包含訪客)
- **需要認證**: 購買、進度更新、交付等寫操作
- **條件式內容保護**: 影片 URL 根據購買狀態動態隱藏

**Service 層權限檢查:**
```java
// 檢查影片內容存取權限 (條件式)
public List<LessonDTO> getCourseLessons(Long courseId, String userEmail) {
    // userEmail 可能為 null (訪客)
    boolean hasAccess = false;
    if (userEmail != null) {
        User user = getUserByEmail(userEmail);
        hasAccess = purchaseService.hasAccess(user.getId(), courseId);
    }

    // 根據 hasAccess 決定是否返回影片 URL
    return lessons.stream()
        .map(lesson -> LessonDTO.from(lesson, hasAccess))
        .toList();
}

// 檢查資源擁有權
if (!resource.getUser().getId().equals(user.getId())) {
    throw new IllegalArgumentException("No permission to access this resource");
}
```

**影片內容保護邏輯:**
```java
// LessonDTO.from(lesson, includeVideoInfo)
public static LessonDTO from(Lesson lesson, boolean includeVideoInfo) {
    return LessonDTO.builder()
        .videoUrl(includeVideoInfo ? lesson.getVideoUrl() : null)
        .videoDuration(includeVideoInfo ? lesson.getVideoDuration() : null)
        .build();
}

// includeVideoInfo 決定條件:
// - 免費課程 (isPremium = false): true (所有人)
// - 付費課程 + 已購買: true (已認證且已購買)
// - 付費課程 + 未購買/訪客: false (隱藏影片 URL)
```

## 異常處理

### 全局異常處理器

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest request) {
        // 400 Bad Request
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(
            IllegalStateException ex, HttpServletRequest request) {
        // 409 Conflict
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        // 500 Internal Server Error
    }
}
```

### 錯誤響應格式

```json
{
  "timestamp": "2025-11-22T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "詳細錯誤訊息",
  "path": "/api/resources"
}
```

## 數據流向

### 查詢流程 (GET /api/courses)

```
Client
  ↓ GET /api/courses + JWT Token
JwtAuthenticationFilter
  ↓ 驗證 Token → 設置 Authentication
CourseController.getCourses()
  ↓ 取得 email from Authentication
CourseService.getCourses(email)
  ↓ 查詢 User
  ↓ 判斷權限 (isPremium)
  ↓ 查詢 Course (過濾)
CourseRepository.findXxx()
  ↓ SQL Query
PostgreSQL
  ↑ ResultSet
CourseService
  ↓ Entity → DTO 轉換
CourseController
  ↓ ResponseEntity<List<CourseDTO>>
Client
```

### 修改流程 (POST /api/progress/submit)

```
Client
  ↓ POST /api/progress/submit + JWT Token
JwtAuthenticationFilter
  ↓ 驗證 Token
ProgressController.submitLesson()
  ↓ 參數驗證 (@Valid)
ProgressService.submitLesson()
  ↓ @Transactional 開始
  ↓ 查詢 User, Progress
  ↓ 業務邏輯驗證
  ↓ 更新 Progress
  ↓ 調用 ExperienceService
  ↓ 更新 User 經驗值與等級
  ↓ @Transactional 提交
  ↑ 返回結果
ProgressController
  ↓ ResponseEntity
Client
```

## 配置管理

### 環境配置

**application.yml** (基礎配置)
```yaml
spring:
  application:
    name: waterball-lms
  profiles:
    active: dev
```

**application-dev.yml** (開發環境)
```yaml
spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/waterball_lms}
    username: ${DATABASE_USERNAME:wblms_user}
    password: ${DATABASE_PASSWORD:WbLms@2024!Dev}

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: dev-secret-key-must-be-at-least-256-bits-long
  expiration: 86400000

logging:
  level:
    com.waterball.lms: DEBUG
```

**application-prod.yml** (生產環境 - 待實現)
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

logging:
  level:
    com.waterball.lms: INFO
```

## 擴展性設計

### 添加新的課程類型

目前支援: VIDEO, ARTICLE, QUIZ

添加新類型步驟:
1. 修改 `Lesson.Type` enum
2. 在 Entity 添加新字段
3. 更新 DTO 映射
4. 實現對應的 Service 邏輯

### 添加新的用戶角色

目前支援: STUDENT, ADMIN

添加新角色步驟:
1. 修改 `User.Role` enum
2. 更新 `SecurityConfig` 權限規則
3. 在 Service 層添加權限檢查

### 事件驅動擴展

未來可考慮使用 Spring Events:

```java
// 發布事件
applicationEventPublisher.publishEvent(
    new UserLevelUpEvent(user, oldLevel, newLevel)
);

// 監聽事件
@EventListener
public void handleLevelUp(UserLevelUpEvent event) {
    // 發送通知、解鎖成就等
}
```

## 效能考量

### 查詢優化
- 使用 `@EntityGraph` 解決 N+1 問題
- Repository 使用 Query Methods 或 `@Query`
- 適當使用索引

### 快取策略 (待實現)
```java
@Cacheable(value = "courses", key = "#isPremium")
public List<CourseDTO> getCourses(boolean isPremium) {
    // ...
}
```

### 分頁查詢 (待實現)
```java
public Page<CourseDTO> getCourses(Pageable pageable) {
    Page<Course> courses = courseRepository.findAll(pageable);
    return courses.map(CourseDTO::from);
}
```

## 監控與日誌

### 日誌策略

- **DEBUG**: 詳細業務邏輯 (開發環境)
- **INFO**: 重要操作記錄 (生產環境)
- **WARN**: 異常狀況但可恢復
- **ERROR**: 錯誤需要關注

### 健康檢查

```java
@GetMapping("/api/health")
public Map<String, Object> health() {
    return Map.of(
        "status", "UP",
        "timestamp", LocalDateTime.now(),
        "service", "Waterball LMS API"
    );
}
```

### 監控端點 (待實現)

可使用 Spring Boot Actuator:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```
