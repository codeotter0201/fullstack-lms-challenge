# 快速參考手冊

## 常用指令

### 開發環境

```bash
# 啟動資料庫
cd deploy && docker-compose up -d postgres

# 啟動應用 (開發模式)
cd backend && ./gradlew bootRun

# 重新編譯並啟動
./gradlew clean bootRun

# 查看日誌
tail -f logs/application.log
```

### Docker

```bash
# 構建並啟動所有服務
cd deploy && docker-compose up -d --build

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f backend
docker-compose logs -f postgres

# 停止服務
docker-compose down

# 停止並清除數據
docker-compose down -v
```

### 資料庫操作

```bash
# 連接到 PostgreSQL
docker exec -it waterball-lms-db psql -U wblms_user -d waterball_lms

# 常用 SQL
\dt                  # 列出所有表
\d users            # 查看 users 表結構
SELECT * FROM users;
\q                  # 退出
```

## API 測試快速指令

```bash
# 健康檢查
curl http://localhost:8080/api/health

# 註冊用戶
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"測試用戶"}'

# 登入取得 Token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# 查看當前用戶
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 取得課程列表
curl http://localhost:8080/api/courses \
  -H "Authorization: Bearer $TOKEN"

# 取得課程單元
curl http://localhost:8080/api/courses/1/lessons \
  -H "Authorization: Bearer $TOKEN"

# 更新進度
curl -X POST http://localhost:8080/api/progress/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1,"position":300,"duration":600}'

# 交付單元
curl -X POST http://localhost:8080/api/progress/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1}'
```

## 專案結構速查

```
backend/
├── src/main/java/com/waterball/lms/
│   ├── WaterballLmsApplication.java   # 應用入口
│   ├── config/                        # 配置類
│   │   ├── SecurityConfig.java        # 安全配置
│   │   ├── OpenApiConfig.java         # Swagger 配置
│   │   └── JpaAuditingConfig.java     # JPA 審計
│   ├── controller/                    # REST 控制器
│   │   ├── AuthController.java        # 認證 API
│   │   ├── CourseController.java      # 課程 API
│   │   ├── ProgressController.java    # 進度 API
│   │   └── HealthController.java      # 健康檢查
│   ├── service/                       # 業務邏輯
│   │   ├── AuthService.java
│   │   ├── CourseService.java
│   │   ├── ProgressService.java
│   │   └── ExperienceService.java
│   ├── repository/                    # 數據訪問
│   │   ├── UserRepository.java
│   │   ├── CourseRepository.java
│   │   ├── LessonRepository.java
│   │   └── ProgressRepository.java
│   ├── model/
│   │   ├── entity/                    # JPA 實體
│   │   │   ├── User.java
│   │   │   ├── Course.java
│   │   │   ├── Lesson.java
│   │   │   └── Progress.java
│   │   └── dto/                       # 數據傳輸對象
│   ├── security/                      # JWT 安全
│   │   ├── JwtTokenProvider.java
│   │   └── JwtAuthenticationFilter.java
│   └── exception/                     # 異常處理
│       ├── GlobalExceptionHandler.java
│       └── ErrorResponse.java
├── src/main/resources/
│   ├── application.yml                # 基礎配置
│   ├── application-dev.yml            # 開發環境配置
│   └── data.sql                       # 初始數據
└── docs/                              # 開發文檔
```

## Entity 關聯速查

```
User
  ├─ Role: STUDENT / ADMIN
  ├─ level: 等級 (由 experience 計算)
  ├─ experience: 經驗值
  └─ isPremium: 付費會員標記

Course
  ├─ isPremium: 是否為付費課程
  ├─ isPublished: 是否已發布
  └─ lessons: 課程單元列表 (1:N)

Lesson
  ├─ type: VIDEO / ARTICLE / QUIZ
  ├─ videoUrl: YouTube URL
  ├─ videoDuration: 影片長度 (秒)
  └─ experienceReward: 完成獎勵經驗值

Progress
  ├─ user: 所屬用戶 (N:1)
  ├─ lesson: 關聯單元 (N:1)
  ├─ progressPercentage: 進度 (0-100)
  ├─ lastPosition: 播放位置 (秒)
  ├─ isCompleted: 是否完成
  ├─ isSubmitted: 是否已交付
  └─ experienceGained: 已獲得經驗值
```

## 核心業務邏輯速查

### 權限控制

```java
// 免費用戶只能看免費課程
if (!user.getIsPremium() && course.getIsPremium()) {
    throw new IllegalArgumentException("Premium course requires subscription");
}
```

### 進度計算

```java
// 進度百分比 = (播放位置 / 影片長度) * 100
progressPercentage = Math.min(100, (position * 100) / duration);
isCompleted = (progressPercentage >= 100);
```

### 等級計算

```java
// 1000 經驗值 = 1 級
// Level 1: 0-999 EXP
// Level 2: 1000-1999 EXP
level = Math.max(1, (experience / 1000) + 1);
```

### 交付驗證

```java
// 必須完成且未交付過
if (!progress.getIsCompleted()) {
    throw new IllegalStateException("Lesson not completed");
}
if (progress.getIsSubmitted()) {
    throw new IllegalStateException("Already submitted");
}
```

## Repository 查詢方法速查

### 命名規則

```java
// 精確查詢
findByEmail(String email)
findById(Long id)

// 條件查詢
findByIsPremiumTrue()
findByIsPremiumFalse()
findByIsPublishedTrue()

// 組合查詢
findByIsPremiumFalseAndIsPublishedTrue()
findByUserIdAndLessonId(Long userId, Long lessonId)

// 排序
findAllOrderByDisplayOrder()
findByUserIdOrderByCreatedAtDesc(Long userId)

// 自定義查詢
@Query("SELECT c FROM Course c WHERE c.isPremium = :isPremium")
List<Course> findByPremiumStatus(@Param("isPremium") boolean isPremium);
```

## 常用 Annotations 速查

### Entity

```java
@Entity                          // JPA 實體
@Table(name = "users")          // 指定表名
@Data                           // Lombok: getter/setter/toString
@Builder                        // Lombok: 建造者模式
@NoArgsConstructor              // Lombok: 無參構造器
@AllArgsConstructor             // Lombok: 全參構造器

// 字段
@Id                             // 主鍵
@GeneratedValue(strategy = IDENTITY) // 自增
@Column(nullable = false)       // 非空
@Column(unique = true)          // 唯一
@Enumerated(EnumType.STRING)    // Enum 類型

// 關聯
@ManyToOne                      // 多對一
@OneToMany(mappedBy = "user")   // 一對多
@JoinColumn(name = "user_id")   // 外鍵列名
```

### Controller

```java
@RestController                 // REST 控制器
@RequestMapping("/api/users")   // 路由前綴
@RequiredArgsConstructor        // Lombok: 構造器注入

// 請求映射
@GetMapping                     // GET 請求
@PostMapping                    // POST 請求
@PutMapping("/{id}")           // PUT 請求
@DeleteMapping("/{id}")        // DELETE 請求

// 參數
@PathVariable Long id          // 路徑參數
@RequestParam String name      // 查詢參數
@RequestBody UserDTO user      // 請求體
@Valid                         // 參數驗證

// Swagger
@Tag(name = "User")            // API 分組
@Operation(summary = "查詢用戶") // API 說明
```

### Service

```java
@Service                        // 服務層
@RequiredArgsConstructor        // 構造器注入
@Transactional(readOnly = true) // 只讀事務 (類級別)
@Transactional                  // 讀寫事務 (方法級別)
```

## 環境變量速查

### 開發環境 (application-dev.yml)

```yaml
DATABASE_URL=jdbc:postgresql://localhost:5432/waterball_lms
DATABASE_USERNAME=wblms_user
DATABASE_PASSWORD=WbLms@2024!Dev
```

### Docker 環境 (docker-compose.yml)

```yaml
# PostgreSQL
POSTGRES_DB=waterball_lms
POSTGRES_USER=wblms_user
POSTGRES_PASSWORD=WbLms@2024!Dev

# Backend
DATABASE_URL=jdbc:postgresql://postgres:5432/waterball_lms
DATABASE_USERNAME=wblms_user
DATABASE_PASSWORD=WbLms@2024!Dev
```

## 錯誤排查速查

### 問題: Lombok 不生效
```bash
# 解決方案
1. 確認 IDE 安裝 Lombok Plugin
2. Settings → Annotation Processors → 啟用
3. Invalidate Caches and Restart
```

### 問題: 資料庫連線失敗
```bash
# 檢查容器狀態
docker-compose ps

# 查看日誌
docker-compose logs postgres

# 測試連線
docker exec -it waterball-lms-db psql -U wblms_user -d waterball_lms
```

### 問題: JWT Token 錯誤
```yaml
# 確認配置
jwt:
  secret: 至少-256-bits-長度的密鑰
  expiration: 86400000  # 24 小時
```

### 問題: CORS 錯誤
```java
// SecurityConfig.java
http.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("*"));
    config.setAllowedHeaders(List.of("*"));
    return config;
}));
```

## 有用連結

- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/v3/api-docs
- Health Check: http://localhost:8080/api/health
- H2 Console: (未啟用，使用 PostgreSQL)

## Git 提交訊息規範

```bash
feat: 新功能
fix: Bug 修復
docs: 文檔更新
style: 代碼格式
refactor: 重構
test: 測試相關
chore: 構建/配置

# 範例
git commit -m "feat: Add comment system for lessons"
git commit -m "fix: Fix JWT token expiration issue"
git commit -m "docs: Update API documentation"
```
