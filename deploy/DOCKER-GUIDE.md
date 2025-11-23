# Docker 部署完整指南

> Waterball LMS - 完整堆疊 Docker 部署文檔

---

## 📋 目錄

1. [快速開始](#快速開始)
2. [服務架構](#服務架構)
3. [環境配置](#環境配置)
4. [部署模式](#部署模式)
5. [CORS 設定](#cors-設定)
6. [常見問題](#常見問題)
7. [開發工作流程](#開發工作流程)
8. [生產部署](#生產部署)

---

## 🚀 快速開始

### 前置需求

- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0
- **最少記憶體**: 4GB RAM
- **硬碟空間**: 5GB

### 1. 基本部署（生產模式）

```bash
# 克隆專案
cd /path/to/fullstack-lms-challenge

# 進入 deploy 目錄
cd deploy

# 啟動所有服務
docker-compose up -d

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f
```

訪問服務：
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432

### 2. 開發模式（Hot Reload）

```bash
cd deploy

# 啟動開發環境
docker-compose -f docker-compose.dev.yml up -d

# 查看前端日誌（即時查看 hot reload）
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

---

## 🏗️ 服務架構

```
┌─────────────────────────────────────────────────────┐
│                   Docker Network                     │
│              (waterball-lms-network)                 │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │              │  │              │  │           │ │
│  │  PostgreSQL  │◄─┤   Backend    │◄─┤ Frontend  │ │
│  │    :5432     │  │    :8080     │  │   :3000   │ │
│  │              │  │              │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                       │
└─────────────────────────────────────────────────────┘
         ▲              ▲              ▲
         │              │              │
   localhost:5432  localhost:8080  localhost:3000
```

### 服務說明

#### PostgreSQL (Database)
- **Image**: `postgres:15-alpine`
- **Container**: `waterball-lms-db`
- **Port**: 5432
- **Database**: waterball_lms
- **User**: wblms_user
- **Password**: WbLms@2024!Dev (開發環境)

#### Spring Boot Backend (API)
- **Build**: Multi-stage (Gradle + JRE)
- **Container**: `waterball-lms-backend`
- **Port**: 8080
- **Profile**: dev (開發) / prod (生產)
- **Health Check**: `/api/health`

#### Next.js Frontend (UI)
- **Build**: Multi-stage (Node 20 Alpine)
- **Container**: `waterball-lms-frontend`
- **Port**: 3000
- **Mode**: standalone (生產優化)
- **Health Check**: `/` (root path)

---

## ⚙️ 環境配置

### 1. Frontend 環境變數

**位置**: `frontend/.env.example`

```env
# === Docker Compose 開發環境 ===
NEXT_PUBLIC_API_URL=http://backend:8080
NEXT_PUBLIC_API_BASE_URL=http://backend:8080/api

# === 本地開發（不使用 Docker） ===
# NEXT_PUBLIC_API_URL=http://localhost:8080
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# === 生產環境 ===
# NEXT_PUBLIC_API_URL=https://api.waterballsa.tw
# NEXT_PUBLIC_API_BASE_URL=https://api.waterballsa.tw/api

# 功能開關
NEXT_PUBLIC_USE_REAL_API=false  # R1: false, R2: true
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_DEBUG=true
```

### 2. Backend 環境變數

**位置**: `deploy/docker-compose.yml` (environment 區塊)

```yaml
environment:
  SPRING_PROFILE: dev
  DATABASE_URL: jdbc:postgresql://postgres:5432/waterball_lms
  DATABASE_USERNAME: wblms_user
  DATABASE_PASSWORD: WbLms@2024!Dev
  JWT_SECRET: dev-secret-key-must-be-at-least-256-bits-long
  JWT_EXPIRATION: 86400000
  SERVER_PORT: 8080
  CORS_ALLOWED_ORIGINS: http://localhost:3000,http://frontend:3000
```

### 3. 環境變數優先級

1. **docker-compose.yml 的 environment 區塊** (最高)
2. `.env.local` (如果使用 `env_file`)
3. `.env.example` (範本，不會被讀取)

---

## 🔧 部署模式

### 模式 1: 生產部署 (docker-compose.yml)

**特點**:
- Frontend 建置為優化的生產版本
- 使用 Next.js standalone 模式（小體積）
- 所有服務容器化
- 適合測試生產環境

**啟動**:
```bash
docker-compose up -d
```

**建置時間**:
- Frontend: ~3-5 分鐘 (首次)
- Backend: ~2-3 分鐘 (首次)
- PostgreSQL: ~10 秒

**映像檔大小**:
- Frontend: ~200MB (standalone mode)
- Backend: ~300MB (JRE + JAR)
- PostgreSQL: ~80MB (Alpine)

---

### 模式 2: 開發部署 (docker-compose.dev.yml)

**特點**:
- Frontend **掛載本地原始碼**
- **Hot Reload** 支援
- 即時反映程式碼變更
- 適合前端開發

**啟動**:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**檔案變更流程**:
```
1. 修改本地 frontend/ 目錄的程式碼
2. Next.js 自動偵測變更
3. 重新編譯 (Fast Refresh)
4. 瀏覽器自動刷新
```

**Volume 掛載**:
```yaml
volumes:
  - ../frontend:/app           # 本地原始碼
  - /app/node_modules          # 容器內的 node_modules
  - /app/.next                 # 容器內的 .next build
```

---

### 模式 3: 本地開發（不使用 Docker Frontend）

**情境**: 只需要 Backend + Database，前端在本地執行

**步驟**:

1. **啟動 Backend + Database**:
```bash
# 編輯 docker-compose.yml，註解掉 frontend service
docker-compose up -d postgres backend
```

2. **本地啟動 Frontend**:
```bash
cd frontend

# 複製環境變數
cp .env.example .env.local

# 修改 .env.local 使用 localhost
# NEXT_PUBLIC_API_URL=http://localhost:8080

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

3. **訪問**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

---

## 🔐 CORS 設定

### 問題背景

在 Docker 環境中，CORS 配置需要考慮兩種訪問來源：

1. **瀏覽器直接訪問**: `http://localhost:3000`
2. **容器間通訊**: `http://frontend:3000`

### Backend CORS 配置

**Spring Boot** (在 `docker-compose.yml` 中配置):

```yaml
backend:
  environment:
    CORS_ALLOWED_ORIGINS: http://localhost:3000,http://frontend:3000
```

**解釋**:
- `http://localhost:3000`: 允許瀏覽器透過 localhost 訪問
- `http://frontend:3000`: 允許前端容器內部請求

### Frontend API 配置

**容器內部** (`docker-compose.yml`):
```yaml
frontend:
  environment:
    NEXT_PUBLIC_API_URL: http://backend:8080  # 使用 service name
```

**本地開發** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080  # 使用 localhost
```

### 請求流程圖

```
瀏覽器 (Client)
    │
    ├─> http://localhost:3000 (訪問前端)
    │
    └─> Frontend Container
            │
            ├─> Server-Side Fetch
            │   http://backend:8080/api (容器內部通訊)
            │
            └─> Client-Side Fetch
                http://localhost:8080/api (透過 host network)
                需要 CORS: http://localhost:3000
```

---

## 🛠️ 常見問題

### Q1: 如何查看容器日誌？

```bash
# 所有服務
docker-compose logs -f

# 特定服務
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres

# 最近 100 行
docker-compose logs --tail=100 frontend
```

### Q2: 如何重新建置服務？

```bash
# 重新建置所有服務
docker-compose up -d --build

# 僅重新建置 frontend
docker-compose up -d --build frontend

# 強制重新建置（無快取）
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Q3: 如何進入容器內部？

```bash
# Frontend
docker exec -it waterball-lms-frontend sh

# Backend
docker exec -it waterball-lms-backend sh

# Database
docker exec -it waterball-lms-db psql -U wblms_user -d waterball_lms
```

### Q4: Port 已被佔用怎麼辦？

**錯誤訊息**:
```
Error: port is already allocated
```

**解決方案**:

1. **檢查佔用**:
```bash
# macOS/Linux
lsof -i :3000
lsof -i :8080

# Windows
netstat -ano | findstr :3000
```

2. **修改 Port 映射**:

編輯 `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3001:3000"  # 外部 3001 → 容器 3000
```

### Q5: Frontend 連不到 Backend？

**檢查清單**:

1. **確認 Backend 已啟動**:
```bash
docker-compose ps
# backend 狀態應為 "Up (healthy)"
```

2. **檢查 Backend Health**:
```bash
curl http://localhost:8080/api/health
# 應回傳 200 OK
```

3. **檢查環境變數**:
```bash
docker exec waterball-lms-frontend printenv | grep API
# 應顯示 NEXT_PUBLIC_API_URL=http://backend:8080
```

4. **檢查 CORS 設定**:
```bash
# 查看 backend 的 CORS 配置
docker-compose logs backend | grep CORS
```

### Q6: 資料庫連線失敗？

**檢查**:

1. **確認 PostgreSQL 健康狀態**:
```bash
docker-compose ps postgres
# 狀態應為 "Up (healthy)"
```

2. **測試連線**:
```bash
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -c "SELECT 1;"
```

3. **查看資料庫日誌**:
```bash
docker-compose logs postgres
```

### Q7: 如何清除所有資料重新開始？

```bash
# 停止並移除容器、網路
docker-compose down

# 同時移除 volumes（會刪除資料庫資料！）
docker-compose down -v

# 移除所有映像檔
docker-compose down --rmi all

# 完整清理（包含 build cache）
docker system prune -a --volumes
```

⚠️ **警告**: `down -v` 會刪除資料庫所有資料！

---

## 💻 開發工作流程

### 情境 1: 前端開發（頻繁修改）

**使用 docker-compose.dev.yml**:

```bash
# 1. 啟動開發環境
cd deploy
docker-compose -f docker-compose.dev.yml up -d

# 2. 查看前端日誌
docker-compose -f docker-compose.dev.yml logs -f frontend-dev

# 3. 修改程式碼
# 在 ../frontend 目錄修改任何檔案

# 4. 觀察 hot reload
# 日誌會顯示重新編譯訊息
# 瀏覽器自動刷新

# 5. 停止開發環境
docker-compose -f docker-compose.dev.yml down
```

### 情境 2: 後端開發

**修改後端程式碼**:

```bash
# 1. 修改後端程式碼
# 在 ../backend 目錄修改 Java 檔案

# 2. 重新建置 Backend
docker-compose up -d --build backend

# 3. 查看建置日誌
docker-compose logs -f backend
```

### 情境 3: 資料庫 Schema 變更

```bash
# 1. 進入資料庫
docker exec -it waterball-lms-db psql -U wblms_user -d waterball_lms

# 2. 執行 SQL 指令
# 例如: ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);

# 3. 或從檔案執行
docker exec -i waterball-lms-db psql -U wblms_user -d waterball_lms < schema.sql
```

### 情境 4: 測試生產建置

```bash
# 1. 使用生產模式建置
docker-compose up -d --build

# 2. 檢查 Frontend 映像檔大小
docker images | grep waterball-lms-frontend

# 3. 測試效能
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000

# 4. 檢查 SEO 和 SSR
curl http://localhost:3000 | grep "<title>"
```

---

## 🚀 生產部署

### 準備清單

- [ ] 修改 `.env.production` 的 API URL
- [ ] 修改 `docker-compose.prod.yml` 的環境變數
- [ ] 修改資料庫密碼
- [ ] 修改 JWT Secret
- [ ] 設定 CORS 為實際域名
- [ ] 配置 SSL 憑證（Nginx 反向代理）
- [ ] 配置備份策略
- [ ] 配置監控和日誌

### 生產環境建議

#### 1. 使用 Environment File

```bash
# 建立 .env.production
cp frontend/.env.example frontend/.env.production

# 編輯生產環境變數
nano frontend/.env.production
```

#### 2. 使用 Docker Secrets（推薦）

```yaml
# docker-compose.prod.yml
services:
  backend:
    environment:
      JWT_SECRET_FILE: /run/secrets/jwt_secret
    secrets:
      - jwt_secret

secrets:
  jwt_secret:
    external: true
```

#### 3. Nginx 反向代理

```nginx
# nginx.conf
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:8080;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 4. 資料庫備份

```bash
# 手動備份
docker exec waterball-lms-db pg_dump -U wblms_user waterball_lms > backup_$(date +%Y%m%d).sql

# 自動備份 (crontab)
0 2 * * * docker exec waterball-lms-db pg_dump -U wblms_user waterball_lms > /backups/waterball_lms_$(date +\%Y\%m\%d).sql
```

#### 5. 監控和日誌

**使用 Docker Logging Driver**:

```yaml
services:
  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

**整合 ELK Stack** (Elasticsearch, Logstash, Kibana)

**整合 Prometheus + Grafana** (效能監控)

---

## 📚 參考資源

### Docker 文檔
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Networking](https://docs.docker.com/network/)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)

### Next.js 部署
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)

### Spring Boot
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker)
- [Spring Boot with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)

---

## 🆘 支援

遇到問題？請檢查：

1. **日誌**: `docker-compose logs -f [service_name]`
2. **健康檢查**: `docker-compose ps`
3. **網路連通性**: `docker network inspect waterball-lms-network`
4. **本地 Port**: `lsof -i :3000 -i :8080 -i :5432`

---

**最後更新**: 2025-01-23
**維護者**: Waterball Academy Team
