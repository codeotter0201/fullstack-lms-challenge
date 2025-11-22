# 水球軟體學院 LMS 重製專案

基於 Spring Boot + Next.js 的學習管理系統 (Learning Management System)

## 專案概述

本專案是水球軟體學院平台的重製版本,透過 4 次 Release 逐步實現完整的學習管理功能。

- **專案時程**: 2025-11-18 ~ 2025-11-27 (10 天)
- **開發方式**: 敏捷開發,快速迭代
- **目標完成度**: 85-95%

## Release 規劃

| Release | 時程 | 核心目標 | 主要功能 |
|---------|------|---------|---------|
| **R1 (MVP)** | 2 天 | 學員能順利上課 | 登入、看影片、進度追蹤、經驗值 |
| **R2** | 3-4 天 | 完整學習體驗 | 課程列表、多課程、排行榜、個人檔案 |
| **R3** | 3-4 天 | 社群互動 | 道館挑戰、徽章、任務系統、技能評級 |
| **R4** | 2-3 天 | 進階功能 | 通知、效能優化、資料分析 |

詳細規劃請參考 [docs/planning/releases-overview.md](docs/planning/releases-overview.md)

## 技術架構

### 後端 (Backend)

- **框架**: Spring Boot 3.4.x
- **語言**: Java 17 (LTS)
- **建構工具**: Gradle 8.5 (Kotlin DSL)
- **資料庫**: PostgreSQL 15
- **安全**: Spring Security + JWT
- **API 文件**: Swagger/OpenAPI

### 前端 (Frontend)

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript 5.x
- **UI**: React 18 + Tailwind CSS
- **狀態管理**: React Context API / Zustand
- **影片播放**: YouTube IFrame API

### 部署架構

- **前端部署**: Vercel
- **後端部署**: Linode / AWS EC2 (Docker)
- **資料庫**: PostgreSQL (Docker, 同機部署)

## 快速開始

### 使用 Docker Compose (推薦)

```bash
# 1. 進入 deploy 目錄
cd deploy

# 2. 啟動所有服務 (PostgreSQL + Backend)
docker-compose up -d

# 3. 查看服務狀態
docker-compose ps

# 4. 查看日誌
docker-compose logs -f backend

# 5. 測試健康檢查
curl http://localhost:8080/api/health

# 6. 查看 API 文件
open http://localhost:8080/swagger-ui.html
```

### 本地開發

#### 後端開發

```bash
# 進入 backend 目錄
cd backend

# 建置專案
./gradlew build

# 執行測試
./gradlew test

# 啟動應用
./gradlew bootRun
```

#### 前端開發

```bash
# 進入 frontend 目錄
cd frontend

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

## 專案結構

```
fullstack-lms-challenge/
├── backend/                    # Spring Boot 後端
│   ├── src/
│   │   ├── main/java/com/waterball/lms/
│   │   │   ├── config/        # 配置類
│   │   │   ├── controller/    # REST Controllers
│   │   │   ├── service/       # 業務邏輯層
│   │   │   ├── repository/    # JPA Repository
│   │   │   ├── model/         # Domain Models
│   │   │   ├── security/      # 安全相關
│   │   │   └── exception/     # 異常處理
│   │   └── test/              # 測試
│   ├── build.gradle.kts       # Gradle 配置
│   └── README.md              # 後端文件
│
├── frontend/                   # Next.js 前端 (待建立)
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # React 元件
│   │   ├── hooks/             # 自定義 Hooks
│   │   ├── lib/               # 工具函數
│   │   └── types/             # TypeScript 型別
│   └── README.md              # 前端文件
│
├── deploy/                     # 部署配置
│   ├── Dockerfile             # 後端 Docker 映像
│   ├── docker-compose.yml     # 本地開發環境
│   ├── docker-compose.prod.yml # 生產環境
│   ├── .env.example           # 環境變數範本
│   └── README.md              # 部署文件
│
└── docs/                       # 專案文件
    ├── planning/              # 規劃文件
    └── README.md              # 文件總覽
```

## API 端點

### 健康檢查

```bash
GET /api/health
```

回應範例:

```json
{
  "status": "UP",
  "timestamp": "2025-11-18T10:30:00",
  "service": "Waterball LMS API"
}
```

### API 文件

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **API 使用範例**: [API-EXAMPLES.md](API-EXAMPLES.md)

## 開發指南

### 後端開發

詳細請參考 [backend/README.md](backend/README.md)

### 前端開發

待補充

### 部署

詳細請參考 [deploy/README.md](deploy/README.md)

## 測試

### 後端測試

```bash
cd backend

# 執行所有測試
./gradlew test

# 執行測試並生成報告
./gradlew test jacocoTestReport
```

### 前端測試

待補充

## 環境變數

### 後端環境變數

複製 `.env.example` 並編輯:

```bash
cd deploy
cp .env.example .env
```

必要環境變數:

- `DATABASE_USERNAME` - PostgreSQL 使用者名稱
- `DATABASE_PASSWORD` - PostgreSQL 密碼
- `JWT_SECRET` - JWT 簽名密鑰 (至少 256 bits)

## 故障排除

### 無法連線到資料庫

```bash
# 檢查 PostgreSQL 是否運行
docker-compose ps postgres

# 檢查日誌
docker-compose logs postgres

# 重新啟動
docker-compose restart postgres
```

### JWT Token 錯誤

確認 `JWT_SECRET` 至少 256 bits (32 字元)

### 更多問題

請參考 [deploy/README.md](deploy/README.md) 的常見問題章節

## 貢獻指南

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

待定

## 聯絡方式

- **Discord**: #需求訪談頻道
- **GitHub Issues**: [專案 Issues](https://github.com/your-org/fullstack-lms-challenge/issues)

---

**專案版本**: v1.0.0 (Release 1)
**建立日期**: 2025-11-18
**最後更新**: 2025-11-18
