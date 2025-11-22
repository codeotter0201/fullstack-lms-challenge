# 水球軟體學院 LMS - Backend 開發文檔

> 本文檔提供水球軟體學院 LMS 後端系統的完整開發指南

## 文檔導覽

- **[README.md](README.md)** - 專案總覽與快速開始 (本文檔)
- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - 常用指令與代碼片段速查表 ⚡
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - 系統架構設計與核心模組說明
- **[API-GUIDE.md](API-GUIDE.md)** - API 開發規範與範例
- **[DATABASE-SCHEMA.md](DATABASE-SCHEMA.md)** - 資料庫架構與查詢範例
- **[DEVELOPMENT-WORKFLOW.md](DEVELOPMENT-WORKFLOW.md)** - 開發工作流程與最佳實踐

> 💡 **新手建議閱讀順序**: README → QUICK-REFERENCE → DEVELOPMENT-WORKFLOW → ARCHITECTURE

---

## 快速開始

### 本地開發環境

```bash
# 1. 啟動 PostgreSQL (使用 Docker)
cd ../deploy
docker-compose up -d postgres

# 2. 執行應用
cd ../backend
./gradlew bootRun --args='--spring.profiles.active=dev'

# 3. 訪問 Swagger UI
open http://localhost:8080/swagger-ui.html
```

### Docker 部署

```bash
cd ../deploy
docker-compose up -d --build
```

## 技術棧

- **Java**: 17 (LTS)
- **Spring Boot**: 3.4.1
- **Build Tool**: Gradle 8.5 (Kotlin DSL)
- **Database**: PostgreSQL 15
- **Security**: Spring Security + JWT
- **API Documentation**: Swagger/OpenAPI 3.0

## 項目結構

```
backend/src/main/java/com/waterball/lms/
├── config/              # 配置類
├── controller/          # REST API 控制器
├── exception/           # 全局異常處理
├── model/
│   ├── dto/            # 數據傳輸對象
│   └── entity/         # JPA 實體
├── repository/         # 資料庫訪問層
├── security/           # JWT 安全機制
└── service/            # 業務邏輯層
```

## 已實現功能 (Release 1)

### 1. 認證系統
- 用戶註冊 (email + password)
- 用戶登入
- JWT Token 驗證
- 用戶資訊查詢

### 2. 課程管理
- 課程列表查詢 (根據用戶權限過濾)
- 課程單元列表
- 單元詳情查詢

### 3. 學習進度
- 影片進度追蹤 (每 10 秒自動保存)
- 完成狀態標記
- 單元交付 (獲得經驗值)

### 4. 經驗系統
- 經驗值累積
- 等級計算 (1000 EXP/級)
- 自動升級

## 核心概念

### 數據模型關係

```
User (用戶)
  ↓ 1:N
Progress (學習進度)
  ↓ N:1
Lesson (單元)
  ↓ N:1
Course (課程)
```

### 權限控制

- **免費用戶**: 只能訪問 `isPremium = false` 的課程
- **付費用戶**: 可訪問所有課程
- 權限在 Service 層過濾

### 進度追蹤邏輯

1. **更新進度** (`/api/progress/update`)
   - 保存播放位置 (秒)
   - 計算完成百分比
   - 自動標記完成狀態 (≥100%)

2. **交付單元** (`/api/progress/submit`)
   - 驗證單元已完成
   - 發放經驗值 (一次性)
   - 更新用戶等級

## 開發指南

### 添加新的 Entity

1. 繼承 `BaseEntity` (自動獲得 id, createdAt, updatedAt)
2. 添加 JPA 註解
3. 使用 Lombok `@Data`, `@Entity`, `@Builder`

```java
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "your_table")
public class YourEntity extends BaseEntity {
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

### 添加新的 API

1. **Controller**: 定義路由和參數驗證
2. **Service**: 實現業務邏輯
3. **Repository**: 數據訪問 (繼承 JpaRepository)
4. **DTO**: 請求/響應對象

範例結構:
```
controller/YourController.java
service/YourService.java
repository/YourRepository.java
model/dto/YourRequest.java
model/dto/YourResponse.java
```

### 數據庫遷移

目前使用 `ddl-auto: update` (開發環境)

添加初始數據:
- 編輯 `src/main/resources/data.sql`
- 使用 `ON CONFLICT DO NOTHING` 避免重複插入

### 安全機制

所有 API 預設需要 JWT Token，除外清單在 `SecurityConfig.java`:

```java
"/api/health",
"/api/auth/**",
"/swagger-ui/**",
"/v3/api-docs/**"
```

獲取當前用戶:
```java
@PostMapping("/your-endpoint")
public ResponseEntity<?> yourMethod(Authentication authentication) {
    String email = authentication.getName();
    // ...
}
```

## 常見任務

### 添加新的課程類型

1. 修改 `Lesson.Type` enum
2. 更新 `LessonDTO` 映射邏輯
3. 調整前端顯示邏輯

### 修改經驗值計算規則

編輯 `ExperienceService.java`:
- `calculateLevel()`: 等級計算公式
- `addExperience()`: 經驗值發放邏輯

### 添加新的用戶角色

1. 修改 `User.Role` enum
2. 更新 `SecurityConfig` 權限規則
3. 調整 Service 層過濾邏輯

## 測試

### API 測試

```bash
# 自動化測試腳本
cd ../deploy
./test-api.sh

# 手動測試
curl http://localhost:8080/api/health
```

### Swagger UI

訪問 http://localhost:8080/swagger-ui.html

1. 使用 `/api/auth/register` 或 `/api/auth/login` 獲取 Token
2. 點擊右上角 "Authorize" 按鈕
3. 輸入 `Bearer <your-token>`
4. 測試需要認證的 API

## 環境變量

### 開發環境 (application-dev.yml)

```yaml
DATABASE_URL=jdbc:postgresql://localhost:5432/waterball_lms
DATABASE_USERNAME=wblms_user
DATABASE_PASSWORD=WbLms@2024!Dev
```

### Docker 環境 (docker-compose.yml)

環境變量通過 Docker Compose 注入

## 注意事項

### Lombok Builder 警告

如果字段有初始值，需要添加 `@Builder.Default`:

```java
@Builder.Default
private Integer level = 1;
```

### JWT Token 設置

- Token 有效期: 24 小時 (86400000 ms)
- Secret Key: 至少 256 bits (HS256 算法)
- 配置位置: `application-dev.yml`

### 日期時間處理

所有 Entity 使用 `LocalDateTime` (JPA Auditing 自動填充)

## 下一步開發建議

### Release 2 功能規劃

1. **Discord OAuth 整合**
   - 添加 Discord OAuth2 登入
   - 用戶資料同步

2. **訂閱系統**
   - ECPay 金流整合
   - 訂閱狀態管理

3. **課程管理後台**
   - ADMIN 角色權限
   - 課程 CRUD API

### 技術優化

1. **資料庫遷移工具**: 考慮使用 Flyway 或 Liquibase
2. **單元測試**: 添加 Service 和 Controller 測試
3. **快取機制**: Redis 整合 (課程列表等)
4. **日誌系統**: 結構化日誌 (Logback + ELK)

## 參考資料

- [Spring Boot 文檔](https://spring.io/projects/spring-boot)
- [JWT.io](https://jwt.io/)
- [API Examples](../../API-EXAMPLES.md)
