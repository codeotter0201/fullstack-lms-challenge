# 開發工作流程

## 開發環境設置

### 必要工具

- **JDK 17** (推薦 Eclipse Temurin 或 Amazon Corretto)
- **IDE**: IntelliJ IDEA (推薦) 或 Eclipse
- **Docker Desktop**: 用於本地數據庫
- **PostgreSQL Client** (可選): psql, DBeaver, TablePlus

### IDE 配置

#### IntelliJ IDEA

1. 安裝 Lombok Plugin
2. 啟用 Annotation Processing:
   - Settings → Build → Compiler → Annotation Processors
   - 勾選 "Enable annotation processing"

3. 配置 Code Style (可選):
   - Settings → Editor → Code Style → Java
   - Scheme: Default / Google Java Style

### 專案導入

```bash
# 1. Clone 專案
git clone <repository-url>
cd fullstack-lms-challenge

# 2. 啟動資料庫
cd deploy
docker-compose up -d postgres

# 3. 確認資料庫連線
docker-compose logs postgres

# 4. 在 IDE 中打開 backend 目錄
# IntelliJ: File → Open → 選擇 backend/build.gradle.kts
```

## 日常開發流程

### 1. 開始新功能

```bash
# 1. 確保在最新的 main 分支
git checkout main
git pull origin main

# 2. 建立功能分支
git checkout -b feature/課程評論系統

# 3. 啟動開發環境
cd deploy
docker-compose up -d postgres
cd ../backend
./gradlew bootRun
```

### 2. 開發新功能

#### Step 1: 定義 Entity

```java
// backend/src/main/java/com/waterball/lms/model/entity/Comment.java
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comments")
public class Comment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false, length = 2000)
    private String content;

    @Builder.Default
    private Integer likes = 0;
}
```

#### Step 2: 建立 Repository

```java
// backend/src/main/java/com/waterball/lms/repository/CommentRepository.java
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByLessonIdOrderByCreatedAtDesc(Long lessonId);
    List<Comment> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

#### Step 3: 定義 DTO

```java
// backend/src/main/java/com/waterball/lms/model/dto/CommentDTO.java
@Data
@Builder
public class CommentDTO {
    private Long id;
    private Long lessonId;
    private UserDTO user;
    private String content;
    private Integer likes;
    private LocalDateTime createdAt;

    public static CommentDTO from(Comment entity) {
        return CommentDTO.builder()
                .id(entity.getId())
                .lessonId(entity.getLesson().getId())
                .user(UserDTO.from(entity.getUser()))
                .content(entity.getContent())
                .likes(entity.getLikes())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

@Data
public class CreateCommentRequest {
    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    @NotBlank(message = "Content is required")
    @Size(max = 2000, message = "Content too long")
    private String content;
}
```

#### Step 4: 實現 Service

```java
// backend/src/main/java/com/waterball/lms/service/CommentService.java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    public List<CommentDTO> getCommentsByLesson(Long lessonId) {
        return commentRepository.findByLessonIdOrderByCreatedAtDesc(lessonId)
                .stream()
                .map(CommentDTO::from)
                .toList();
    }

    @Transactional
    public CommentDTO createComment(String email, CreateCommentRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        Comment comment = Comment.builder()
                .user(user)
                .lesson(lesson)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);
        return CommentDTO.from(comment);
    }
}
```

#### Step 5: 建立 Controller

```java
// backend/src/main/java/com/waterball/lms/controller/CommentController.java
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comment", description = "評論相關 API")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/lessons/{lessonId}")
    @Operation(summary = "取得單元的所有評論")
    public ResponseEntity<List<CommentDTO>> getCommentsByLesson(
            @PathVariable Long lessonId) {
        List<CommentDTO> comments = commentService.getCommentsByLesson(lessonId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    @Operation(summary = "發表評論")
    public ResponseEntity<CommentDTO> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        CommentDTO comment = commentService.createComment(email, request);
        return ResponseEntity.ok(comment);
    }
}
```

### 3. 測試功能

#### 使用 Swagger UI 測試

```bash
# 1. 啟動應用
./gradlew bootRun

# 2. 打開瀏覽器
open http://localhost:8080/swagger-ui.html

# 3. 測試流程
# - 登入取得 Token
# - 點擊 Authorize 輸入 Token
# - 測試新的 Comment API
```

#### 使用 curl 測試

```bash
# 1. 登入取得 Token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# 2. 測試發表評論
curl -X POST http://localhost:8080/api/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1,"content":"很棒的課程!"}'

# 3. 取得單元評論
curl -X GET http://localhost:8080/api/comments/lessons/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 4. 提交代碼

```bash
# 1. 查看修改
git status
git diff

# 2. 添加檔案
git add .

# 3. 提交 (使用有意義的 commit message)
git commit -m "feat: Add comment system for lessons

- Add Comment entity and repository
- Implement CommentService with create and list methods
- Add CommentController with REST endpoints
- Add CreateCommentRequest and CommentDTO"

# 4. 推送到遠端
git push origin feature/課程評論系統
```

### 5. Code Review & Merge

```bash
# 1. 建立 Pull Request (在 GitHub/GitLab)
# 2. 等待 Code Review
# 3. 根據反饋修改代碼
# 4. 合併到 main
# 5. 刪除功能分支
git checkout main
git pull origin main
git branch -d feature/課程評論系統
```

## 常見開發任務

### 添加資料庫遷移 (Flyway Migration)

專案使用 Flyway 進行資料庫版本控制。所有 schema 變更都必須通過 migration 檔案。

#### 建立新的 Migration 檔案

**步驟 1**: 確定版本號
```bash
# 查看現有 migration
ls -la backend/src/main/resources/db/migration/
# V1__init_schema.sql
# V2__insert_initial_data.sql
# 下一個版本: V3
```

**步驟 2**: 建立 migration 檔案

檔案命名: `V{版本號}__{描述}.sql`

範例 - 新增欄位:
```sql
-- backend/src/main/resources/db/migration/V3__add_user_phone.sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
CREATE INDEX idx_users_phone ON users(phone_number);
```

範例 - 新增資料表:
```sql
-- backend/src/main/resources/db/migration/V4__create_comments_table.sql
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_lesson ON comments(lesson_id);
CREATE INDEX idx_comments_user ON comments(user_id);
```

範例 - 資料遷移:
```sql
-- backend/src/main/resources/db/migration/V5__migrate_premium_users.sql
UPDATE users
SET is_premium = true
WHERE experience > 10000 AND is_premium = false;
```

**步驟 3**: 測試 migration

```bash
# 重啟服務以執行 migration
cd deploy
docker-compose restart backend

# 查看 migration 執行結果
docker-compose logs backend | grep Flyway

# 驗證 migration 歷史
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms \
  -c "SELECT installed_rank, version, description, success FROM flyway_schema_history;"
```

**步驟 4**: 驗證 schema 變更

```bash
# 檢查表結構
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -c "\d users"

# 測試新功能的 API
curl -X GET http://localhost:8080/api/...
```

#### Migration 注意事項

1. **不可修改已執行的 migration**: Flyway 會記錄 checksum，修改會導致錯誤
2. **向後兼容**: 盡量保持向後兼容，避免 breaking changes
3. **原子性**: 每個 migration 應該是原子性的完整操作
4. **測試環境先行**: 先在開發環境測試，再部署到生產環境
5. **備份優先**: 生產環境執行前務必備份資料庫

### 修改現有 API

```bash
# 1. 找到相關的 Controller
# 2. 修改 Service 邏輯
# 3. 更新 DTO (如果需要)
# 4. 測試修改
# 5. 提交代碼
```

### 修復 Bug

```bash
# 1. 建立 bugfix 分支
git checkout -b bugfix/修復進度更新問題

# 2. 重現問題
# 3. 修改代碼
# 4. 測試驗證
# 5. 提交並建立 PR
```

## 代碼規範

### 命名規範

**Java 類別:**
- Entity: `User`, `Course`, `Lesson`
- DTO: `UserDTO`, `LoginRequest`, `AuthResponse`
- Service: `UserService`, `CourseService`
- Controller: `UserController`, `CourseController`
- Repository: `UserRepository`, `CourseRepository`

**方法命名:**
- 查詢: `getUser()`, `findCourses()`, `listLessons()`
- 創建: `createUser()`, `addCourse()`
- 更新: `updateUser()`, `modifyCourse()`
- 刪除: `deleteUser()`, `removeCourse()`

**變數命名:**
- 使用駝峰式: `userId`, `courseTitle`
- 布林值: `isCompleted`, `isPremium`, `hasPermission`

### 註解規範

**Entity:**
```java
/**
 * 用戶實體
 * 儲存用戶基本資訊與認證資料
 */
@Entity
public class User extends BaseEntity {
    // ...
}
```

**Service 方法:**
```java
/**
 * 更新學習進度
 *
 * @param email 用戶 email
 * @param request 進度更新請求 (包含 lessonId, position, duration)
 * @return 更新後的進度資訊
 * @throws IllegalArgumentException 當用戶或單元不存在時
 */
public Map<String, Object> updateProgress(String email, ProgressUpdateRequest request) {
    // ...
}
```

### 異常處理

```java
// ✅ 好的做法
if (user == null) {
    throw new IllegalArgumentException("User not found: " + email);
}

// ❌ 不好的做法
if (user == null) {
    return null;  // 不要返回 null
}
```

## 除錯技巧

### 查看 SQL 日誌

```yaml
# application-dev.yml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### 使用 Debugger

1. 在 IDE 中設置斷點
2. 使用 Debug 模式啟動 (Shift + F9)
3. 發送 API 請求觸發斷點
4. 逐步執行檢查變數值

### 查看資料庫內容

```bash
# 連接到容器內的 PostgreSQL
docker exec -it waterball-lms-db psql -U wblms_user -d waterball_lms

# 查詢用戶
SELECT * FROM users;

# 查詢進度
SELECT u.email, l.title, p.progress_percentage, p.is_completed
FROM progress p
JOIN users u ON p.user_id = u.id
JOIN lessons l ON p.lesson_id = l.id;

# 退出
\q
```

## 效能優化

### 避免 N+1 查詢

```java
// ❌ 不好的做法
List<Course> courses = courseRepository.findAll();
for (Course course : courses) {
    System.out.println(course.getLessons().size());  // N+1 查詢
}

// ✅ 好的做法
@Query("SELECT c FROM Course c LEFT JOIN FETCH c.lessons WHERE c.id = :id")
Optional<Course> findByIdWithLessons(@Param("id") Long id);
```

### 使用適當的索引

```java
// Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    // 需要在 (user_id, lesson_id) 建立索引
    Optional<Progress> findByUserIdAndLessonId(Long userId, Long lessonId);
}
```

## 常見問題

### Lombok 不生效

```bash
# 1. 確認 IDE 安裝 Lombok Plugin
# 2. 啟用 Annotation Processing
# 3. Invalidate Caches and Restart
```

### 資料庫連線失敗

```bash
# 1. 確認 PostgreSQL 容器運行
docker-compose ps

# 2. 查看日誌
docker-compose logs postgres

# 3. 測試連線
docker exec -it waterball-lms-db psql -U wblms_user -d waterball_lms
```

### JWT Token 過期

```yaml
# 調整 Token 有效期 (application-dev.yml)
jwt:
  expiration: 86400000  # 24 小時 (毫秒)
```

## 部署流程

### 本地 Docker 部署

```bash
# 1. 構建並啟動所有服務
cd deploy
docker-compose up -d --build

# 2. 查看日誌
docker-compose logs -f backend

# 3. 測試健康檢查
curl http://localhost:8080/api/health

# 4. 停止服務
docker-compose down
```

### 生產環境部署 (待實現)

1. 配置生產環境變數
2. 使用 `application-prod.yml`
3. 配置 HTTPS
4. 設置資料庫備份
5. 配置監控與告警
