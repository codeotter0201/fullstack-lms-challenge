# Waterball LMS - Docker 部署

> 完整堆疊 (PostgreSQL + Spring Boot + Next.js) 的 Docker Compose 配置

---

## 🚀 快速開始

### 生產模式（完整建置）

**HTTP 模式（使用 IP 或 localhost）**：
```bash
docker-compose up -d
```

**HTTPS 模式（需要真實域名）**：
```bash
# 1. 設定環境變數（參考 .env.example）
cp .env.example .env
nano .env  # 設定 DOMAIN 和 ENABLE_HTTPS=true

# 2. 使用自動化腳本
./setup-https.sh

# 或手動啟動
docker-compose -f docker-compose.prod.yml up -d
```

訪問：
- **Frontend**: http://localhost:3000 或 https://your-domain.com
- **Backend**: http://localhost:8080 或 https://your-domain.com/api
- **Swagger**: http://localhost:8080/swagger-ui.html

### 開發模式（Hot Reload）

```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

## 📁 檔案說明

| 檔案 | 說明 |
|------|------|
| `docker-compose.yml` | **生產部署**：完整建置所有服務 (HTTP) |
| `docker-compose.dev.yml` | **開發環境**：Frontend hot reload |
| `docker-compose.prod.yml` | **正式環境**：含 Traefik 反向代理和 HTTPS 支援 |
| `setup-https.sh` | **HTTPS 自動化腳本**：一鍵設定免費 SSL 憑證 |
| `.env.example` | **環境變數範本**：包含 HTTPS 配置選項 |
| `PRODUCTION-DEPLOYMENT.md` | **完整部署指南**（含 HTTPS 設定） |
| `HTTPS-QUICKSTART.md` | **HTTPS 快速入門**（5 分鐘設定） |
| `DOCKER-GUIDE.md` | **Docker 使用指南** |

---

## 🏗️ 架構

```
PostgreSQL :5432 → Spring Boot :8080 → Next.js :3000
    │                    │                  │
    └────────── Docker Network ────────────┘
```

---

## ⚙️ 環境變數

### Frontend (`frontend/.env.example`)

```env
# Docker Compose（容器內部通訊）
NEXT_PUBLIC_API_URL=http://backend:8080

# 本地開發（不使用 Docker）
# NEXT_PUBLIC_API_URL=http://localhost:8080

# 生產環境
# NEXT_PUBLIC_API_URL=https://api.waterballsa.tw
```

### Backend (`docker-compose.yml`)

```yaml
CORS_ALLOWED_ORIGINS: http://localhost:3000,http://frontend:3000
DATABASE_URL: jdbc:postgresql://postgres:5432/waterball_lms
JWT_SECRET: [請修改為強密碼]
```

---

## 🔧 常用指令

### 啟動 / 停止

```bash
# 啟動所有服務（背景執行）
docker-compose up -d

# 停止所有服務
docker-compose down

# 停止並移除 volumes（會刪除資料庫資料！）
docker-compose down -v
```

### 查看狀態

```bash
# 查看服務狀態
docker-compose ps

# 查看日誌（即時）
docker-compose logs -f

# 查看特定服務日誌
docker-compose logs -f frontend
```

### 重新建置

```bash
# 重新建置並啟動
docker-compose up -d --build

# 僅重新建置 Frontend
docker-compose up -d --build frontend

# 強制重新建置（無快取）
docker-compose build --no-cache frontend
```

### 進入容器

```bash
# Frontend
docker exec -it waterball-lms-frontend sh

# Backend
docker exec -it waterball-lms-backend sh

# Database
docker exec -it waterball-lms-db psql -U wblms_user -d waterball_lms
```

---

## 🔐 CORS 配置

### Backend 必須配置

```yaml
backend:
  environment:
    CORS_ALLOWED_ORIGINS: http://localhost:3000,http://frontend:3000
```

### 為什麼需要兩個來源？

1. **`localhost:3000`**: 瀏覽器直接訪問
2. **`frontend:3000`**: 容器內部通訊（SSR）

### 請求流程

```
瀏覽器 → localhost:3000 (Frontend)
         → 容器內 fetch → backend:8080 (API)
         → 回傳資料 → 瀏覽器
```

---

## 🐛 常見問題

### Q: Port 被佔用

```bash
# 檢查佔用
lsof -i :3000

# 修改 docker-compose.yml
ports:
  - "3001:3000"  # 改用 3001
```

### Q: Frontend 連不到 Backend

**檢查清單**:
1. ✅ Backend 狀態 `healthy`
2. ✅ 環境變數 `NEXT_PUBLIC_API_URL=http://backend:8080`
3. ✅ CORS 設定正確

```bash
# 確認 Backend 健康
curl http://localhost:8080/api/health

# 確認環境變數
docker exec waterball-lms-frontend printenv | grep API
```

### Q: 資料庫連線失敗

```bash
# 測試連線
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -c "SELECT 1;"

# 查看日誌
docker-compose logs postgres
```

---

## 🛠️ 開發工作流程

### 前端開發（Hot Reload）

```bash
# 1. 啟動開發環境
docker-compose -f docker-compose.dev.yml up -d

# 2. 修改程式碼
# 在 ../frontend 目錄修改任何檔案

# 3. 自動重新載入
# Next.js 會自動偵測並重新編譯
```

### 後端開發

```bash
# 1. 修改後端程式碼
# 在 ../backend 目錄修改 Java 檔案

# 2. 重新建置
docker-compose up -d --build backend
```

---

## 📊 監控

### 健康檢查

```bash
# 檢查所有服務健康狀態
docker-compose ps

# 應顯示:
# postgres   Up (healthy)
# backend    Up (healthy)
# frontend   Up (healthy)
```

### 資源使用

```bash
# 查看資源使用情況
docker stats

# 查看映像檔大小
docker images | grep waterball
```

### 停止服務

```bash
# 停止所有服務
docker-compose down

# 停止並刪除 volumes (清空資料庫)
docker-compose down -v
```

---

## 🔒 HTTPS 設定（免費 SSL 憑證）

### 快速設定（5 分鐘）

1. **取得免費域名**（推薦 [DuckDNS](https://www.duckdns.org)）
2. **設定環境變數**：
   ```bash
   cp .env.example .env
   nano .env  # 設定 DOMAIN、ENABLE_HTTPS=true、ACME_EMAIL
   ```
3. **執行自動化腳本**：
   ```bash
   ./setup-https.sh
   ```

就這麼簡單！🎉

### 詳細文檔

- **5 分鐘入門**：[HTTPS-QUICKSTART.md](./HTTPS-QUICKSTART.md)
- **完整指南**：[PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md#https-設定免費-ssl-憑證)

### 免費域名推薦

- [DuckDNS](https://www.duckdns.org) - 最簡單（yourapp.duckdns.org）
- [Freenom](https://www.freenom.com) - 免費頂級域名（.tk, .ml）
- [NoIP](https://www.noip.com) - 動態 DNS

---

## 生產環境部署

### 部署到 Linode / AWS EC2

#### 1. 準備伺服器

```bash
# SSH 連線到伺服器
ssh your-user@your-server-ip

# 安裝 Docker 和 Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 安裝 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. 部署應用

```bash
# 建立專案目錄
mkdir -p ~/waterball-lms
cd ~/waterball-lms

# 複製專案檔案 (從本地上傳或 git clone)
# 方法 1: 使用 git
git clone <your-repo-url> .

# 方法 2: 使用 scp 上傳
# (在本地執行)
scp -r deploy backend your-user@your-server-ip:~/waterball-lms/

# 設定環境變數
cd deploy
cp .env.example .env
nano .env  # 編輯環境變數

# 啟動生產環境
docker-compose -f docker-compose.prod.yml up -d

# 查看服務狀態
docker-compose -f docker-compose.prod.yml ps

# 查看日誌
docker-compose -f docker-compose.prod.yml logs -f
```

#### 3. 配置 Nginx (可選 - 用於 HTTPS 和反向代理)

```bash
# 安裝 Nginx
sudo apt update
sudo apt install nginx

# 設定反向代理
sudo nano /etc/nginx/sites-available/waterball-lms
```

Nginx 配置範例:

```nginx
server {
    listen 80;
    server_name api.waterball-lms.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 啟用配置
sudo ln -s /etc/nginx/sites-available/waterball-lms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 設定 HTTPS (使用 Certbot)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.waterball-lms.com
```

#### 4. 環境變數配置

編輯 `deploy/.env`:

```bash
# Database Configuration
DATABASE_NAME=waterball_lms_prod
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=YOUR_SECURE_PASSWORD

# JWT Configuration (使用強密碼生成器)
JWT_SECRET=YOUR_GENERATED_SECRET_KEY_AT_LEAST_256_BITS
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080
```

#### 5. 更新部署

```bash
# 拉取最新程式碼
cd ~/waterball-lms
git pull

# 重新建置並啟動
cd deploy
docker-compose -f docker-compose.prod.yml up -d --build

# 查看日誌確認啟動成功
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 常見問題

### 1. 無法連線到資料庫

**問題**: Backend 啟動失敗,顯示 `Connection refused`

**解決方法**:

```bash
# 檢查 PostgreSQL 是否正常運行
docker-compose ps postgres

# 檢查 PostgreSQL 日誌
docker-compose logs postgres

# 重新啟動服務
docker-compose restart postgres
docker-compose restart backend
```

### 2. JWT Token 錯誤

**問題**: API 回應 `Invalid JWT token`

**解決方法**:

- 確認 `JWT_SECRET` 至少 256 bits (32 字元)
- 檢查環境變數是否正確設定
- 重新啟動 Backend 服務

### 3. Swagger UI 無法訪問

**問題**: http://localhost:8080/swagger-ui.html 顯示 404

**解決方法**:

- 檢查 Backend 是否正常啟動
- 訪問 http://localhost:8080/v3/api-docs 確認 OpenAPI JSON 可以取得
- 清除瀏覽器快取重試

### 4. 容器健康檢查失敗

**問題**: `docker-compose ps` 顯示服務 unhealthy

**解決方法**:

```bash
# 檢查健康檢查端點
curl http://localhost:8080/api/health

# 檢查容器日誌
docker-compose logs backend

# 進入容器內部檢查
docker-compose exec backend sh
wget http://localhost:8080/api/health
```

### 5. 如何重置資料庫

```bash
# 停止服務並刪除 volumes
docker-compose down -v

# 重新啟動
docker-compose up -d
```

---

## 技術支援

如有問題,請查看:

- **後端日誌**: `docker-compose logs backend`
- **資料庫日誌**: `docker-compose logs postgres`
- **健康檢查**: http://localhost:8080/api/health
- **API 文件**: http://localhost:8080/swagger-ui.html

---

**文件版本**: v1.0
**更新日期**: 2025-11-18
