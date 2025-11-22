# 水球軟體學院 LMS - 後端 API

Spring Boot 3.4.x + Java 17 + PostgreSQL

## 技術棧

- **框架**: Spring Boot 3.4.1
- **語言**: Java 17 (LTS)
- **建構工具**: Gradle 8.5 (Kotlin DSL)
- **資料庫**: PostgreSQL 15
- **安全**: Spring Security + JWT
- **API 文件**: Swagger/OpenAPI 3.0

## 快速開始

### 使用 Docker Compose (推薦)

```bash
# 進入 deploy 目錄
cd deploy

# 啟動所有服務
docker-compose up -d

# 查看日誌
docker-compose logs -f backend
```

### 本地開發 (無 Docker)

#### 前置需求

- Java 17+
- PostgreSQL 15+ (本地運行)
- Gradle 8.5+ (或使用 ./gradlew)

#### 啟動步驟

```bash
# 1. 啟動 PostgreSQL (本地或 Docker)
docker run -d \
  --name postgres \
  -e POSTGRES_DB=waterball_lms \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# 2. 進入 backend 目錄
cd backend

# 3. 建置專案
./gradlew build

# 4. 啟動應用
./gradlew bootRun
```

## API 端點

### 健康檢查

```bash
# 檢查服務狀態
curl http://localhost:8080/api/health
```

### API 文件

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 專案結構

```
backend/
├── src/main/java/com/waterball/lms/
│   ├── WaterballLmsApplication.java          # 主程式
│   ├── config/                                # 配置類
│   │   ├── SecurityConfig.java                # Spring Security 配置
│   │   └── OpenApiConfig.java                 # Swagger 配置
│   ├── controller/                            # REST Controllers
│   │   └── HealthController.java              # 健康檢查端點
│   ├── service/                               # 業務邏輯層
│   ├── repository/                            # JPA Repository
│   ├── model/                                 # Domain Models
│   │   ├── entity/                            # JPA Entities
│   │   └── dto/                               # Data Transfer Objects
│   ├── security/                              # 安全相關
│   │   ├── JwtTokenProvider.java              # JWT 生成/驗證
│   │   └── JwtAuthenticationFilter.java       # JWT 過濾器
│   └── exception/                             # 異常處理
│       ├── GlobalExceptionHandler.java        # 全域異常處理器
│       └── ErrorResponse.java                 # 錯誤回應格式
├── src/main/resources/
│   ├── application.yml                        # 主配置檔
│   ├── application-dev.yml                    # 開發環境配置
│   └── application-prod.yml                   # 生產環境配置
└── build.gradle.kts                           # Gradle 配置
```

## 環境配置

### 開發環境 (application-dev.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/waterball_lms
    username: postgres
    password: postgres
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update
```

### 生產環境 (application-prod.yml)

使用環境變數配置:

- `DATABASE_URL`: PostgreSQL 連線 URL
- `DATABASE_USERNAME`: 資料庫使用者名稱
- `DATABASE_PASSWORD`: 資料庫密碼
- `JWT_SECRET`: JWT 簽名密鑰 (至少 256 bits)
- `JWT_EXPIRATION`: Token 有效期限 (毫秒)

## 開發指南

### 新增 Controller

```java
@RestController
@RequestMapping("/api/example")
public class ExampleController {

    @GetMapping
    public ResponseEntity<String> example() {
        return ResponseEntity.ok("Example");
    }
}
```

### 新增 Entity

```java
@Entity
@Table(name = "examples")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Example {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
}
```

### 新增 Repository

```java
public interface ExampleRepository extends JpaRepository<Example, Long> {
    List<Example> findByName(String name);
}
```

## 測試

```bash
# 執行所有測試
./gradlew test

# 執行測試並生成報告
./gradlew test jacocoTestReport
```

## 建置與部署

```bash
# 建置 JAR 檔案
./gradlew clean build

# 建置 Docker 映像
docker build -f ../deploy/Dockerfile -t waterball-lms-backend .

# 執行 JAR 檔案
java -jar build/libs/waterball-lms-0.0.1-SNAPSHOT.jar
```

## 故障排除

### 無法連線到資料庫

```bash
# 檢查 PostgreSQL 是否運行
docker ps | grep postgres

# 檢查連線設定
psql -h localhost -U postgres -d waterball_lms
```

### JWT Token 錯誤

確認 `JWT_SECRET` 至少 256 bits (32 字元)

### Gradle 建置失敗

```bash
# 清除 Gradle 快取
./gradlew clean

# 重新下載依賴
./gradlew build --refresh-dependencies
```

---

**版本**: v1.0.0
**更新日期**: 2025-11-18
