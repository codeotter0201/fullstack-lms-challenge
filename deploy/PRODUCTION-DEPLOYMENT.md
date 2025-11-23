# 生產環境部署指南

> Waterball LMS - 使用 Traefik 反向代理的生產環境部署

---

## 📋 目錄

1. [架構概覽](#架構概覽)
2. [前置需求](#前置需求)
3. [快速開始](#快速開始)
4. [環境變數配置](#環境變數配置)
5. [HTTPS 設定（免費 SSL 憑證）](#https-設定免費-ssl-憑證)
6. [部署步驟](#部署步驟)
7. [驗證部署](#驗證部署)
8. [常見問題](#常見問題)
9. [進階配置](#進階配置)

---

## 🏗️ 架構概覽

### 服務架構

```
外部用戶
    ↓
http://YOUR_IP (port 80)
    ↓
┌─────────────────────────────────────┐
│         Traefik (反向代理)           │
├─────────────────────────────────────┤
│  /      → Frontend (Next.js:3000)   │
│  /api   → Backend (Spring:8080)     │
└─────────────────────────────────────┘
                ↓
         PostgreSQL:5432
```

### 服務說明

| 服務 | 容器名稱 | 內部端口 | 外部訪問 | 說明 |
|------|---------|---------|----------|------|
| Traefik | waterball-lms-traefik | 80 | `http://${DOMAIN}` | 反向代理，統一入口 |
| Frontend | waterball-lms-frontend-prod | 3000 | 透過 Traefik | Next.js 應用程式 |
| Backend | waterball-lms-backend-prod | 8080 | 透過 Traefik (`/api`) | Spring Boot API |
| PostgreSQL | waterball-lms-db-prod | 5432 | 內部網路 | 資料庫 |

### 路由規則

- **Frontend**: `http://${DOMAIN}/` → 前端所有頁面
- **Backend API**: `http://${DOMAIN}/api` → 後端 API 端點
- **Traefik Dashboard** (可選): `http://${DOMAIN}:8081/dashboard/`

---

## 🔧 前置需求

### 伺服器需求

- **作業系統**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **記憶體**: 最少 4GB RAM (建議 8GB+)
- **硬碟**: 最少 20GB 可用空間
- **網路**: 可對外的 IP 位址或域名

### 軟體需求

- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0

### 安裝 Docker 和 Docker Compose

```bash
# 安裝 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 將當前使用者加入 docker 群組（避免每次都要 sudo）
sudo usermod -aG docker $USER
newgrp docker

# 安裝 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 驗證安裝
docker --version
docker-compose --version
```

---

## 🚀 快速開始

### 方法一：使用 Git Clone（推薦）

```bash
# 1. Clone 專案
git clone <your-repository-url>
cd fullstack-lms-challenge

# 2. 進入 deploy 目錄
cd deploy

# 3. 複製環境變數範本
cp .env.example .env

# 4. 編輯環境變數（重要！）
nano .env  # 或使用 vim .env

# 5. 啟動所有服務
docker-compose -f docker-compose.prod.yml up -d

# 6. 查看啟動狀態
docker-compose -f docker-compose.prod.yml ps
```

### 方法二：手動上傳檔案

```bash
# 在本地機器執行
# 將專案檔案上傳到伺服器
scp -r deploy backend frontend your-user@your-server-ip:~/waterball-lms/

# SSH 連線到伺服器
ssh your-user@your-server-ip

# 在伺服器上執行
cd ~/waterball-lms/deploy
cp .env.example .env
nano .env  # 編輯環境變數
docker-compose -f docker-compose.prod.yml up -d
```

---

## ⚙️ 環境變數配置

### 必要配置項目

編輯 `deploy/.env` 檔案：

```bash
# =============================================================================
# Domain Configuration（必須修改！）
# =============================================================================

# 填入你的伺服器 IP 或域名
# 範例：
#   - DOMAIN=192.168.1.100  （使用 IP 位址）
#   - DOMAIN=api.example.com（使用域名）
DOMAIN=your-server-ip-or-domain

# 協定（如果有 SSL 憑證請改為 https）
PROTOCOL=http

# =============================================================================
# Database Configuration（建議修改密碼）
# =============================================================================
DATABASE_NAME=waterball_lms
DATABASE_USERNAME=wblms_user
DATABASE_PASSWORD=your-secure-password-here  # 請改為強密碼

# =============================================================================
# Backend Configuration（必須修改 JWT Secret）
# =============================================================================
SPRING_PROFILE=prod

# JWT Secret（至少 256 bits，請使用隨機生成的密鑰）
# 生成方式: openssl rand -base64 32
JWT_SECRET=your-generated-secret-key-must-be-at-least-256-bits-long

JWT_EXPIRATION=86400000  # 24小時（毫秒）
SERVER_PORT=8080

# =============================================================================
# Frontend Configuration
# =============================================================================
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_USE_REAL_API=true
NEXT_PUBLIC_DEBUG=false

# =============================================================================
# Traefik Configuration（可選）
# =============================================================================
# 是否啟用 Traefik Dashboard（預設關閉）
TRAEFIK_DASHBOARD=false

# Traefik Dashboard 端口（僅當 TRAEFIK_DASHBOARD=true 時使用）
TRAEFIK_DASHBOARD_PORT=8081
```

### 生成安全的 JWT Secret

```bash
# 使用 OpenSSL 生成隨機 secret
openssl rand -base64 32

# 或使用 Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🔒 HTTPS 設定（免費 SSL 憑證）

### 為什麼需要 HTTPS？

- ✅ 資料加密傳輸（保護用戶隱私）
- ✅ 瀏覽器不會顯示「不安全」警告
- ✅ SEO 排名更好
- ✅ 現代瀏覽器的許多功能要求 HTTPS（如 WebRTC、Service Worker 等）

### 前置需求

**⚠️ 重要：HTTPS 需要真實域名，不能使用 IP 位址**

1. **擁有域名**（可使用免費域名服務）：
   - [DuckDNS](https://www.duckdns.org) - 免費動態 DNS（推薦新手）
   - [Freenom](https://www.freenom.com) - 免費域名（.tk, .ml, .ga, .cf, .gq）
   - [NoIP](https://www.noip.com) - 免費動態 DNS
   - [Cloudflare](https://www.cloudflare.com) - 可購買域名並提供免費 CDN

2. **DNS 已正確設定**：
   - 將域名的 A 記錄指向你的伺服器 IP

3. **防火牆開放 Port 80 和 443**：
   ```bash
   # Ubuntu/Debian
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw reload

   # CentOS/RHEL
   sudo firewall-cmd --permanent --add-port=80/tcp
   sudo firewall-cmd --permanent --add-port=443/tcp
   sudo firewall-cmd --reload
   ```

### 方法一：使用自動化腳本（推薦）

我們提供了一個自動化設定腳本 `setup-https.sh`，會自動幫你配置所有必要的設定。

```bash
cd deploy

# 1. 確保 .env 已設定基本配置
cp .env.example .env
nano .env  # 至少設定 DOMAIN

# 2. 執行 HTTPS 設定腳本
./setup-https.sh
```

腳本會自動：
- ✅ 驗證域名設定
- ✅ 詢問並設定 Let's Encrypt email
- ✅ 選擇 Staging（測試）或 Production（正式）環境
- ✅ 更新 .env 檔案
- ✅ 創建必要的目錄
- ✅ 啟動服務

### 方法二：手動設定

如果你想手動設定 HTTPS，請按照以下步驟：

#### 1. 取得免費域名（如果還沒有）

**使用 DuckDNS（最簡單）**：

1. 訪問 [https://www.duckdns.org](https://www.duckdns.org)
2. 使用 Google/GitHub 帳號登入
3. 創建一個子域名（例如：`myapp.duckdns.org`）
4. 設定 IP 為你的伺服器 IP
5. 記下你的 token（用於自動更新 IP）

#### 2. 驗證 DNS 設定

```bash
# 檢查域名是否正確指向你的伺服器
nslookup your-domain.com

# 或使用 dig
dig your-domain.com +short

# 應該返回你的伺服器 IP
```

#### 3. 編輯 .env 檔案

```bash
cd deploy
nano .env
```

設定以下變數：

```bash
# 你的域名（不是 IP！）
DOMAIN=myapp.duckdns.org

# 啟用 HTTPS
ENABLE_HTTPS=true

# 你的 Email（Let's Encrypt 會發送到期提醒）
ACME_EMAIL=your-email@example.com

# Let's Encrypt 環境
# 建議先用 staging 測試，確認沒問題再改為 production
ACME_ENV=staging

# ACME CA Server（會根據 ACME_ENV 自動設定）
# Staging: https://acme-staging-v02.api.letsencrypt.org/directory
# Production: https://acme-v02.api.letsencrypt.org/directory
ACME_CA_SERVER=https://acme-staging-v02.api.letsencrypt.org/directory
```

#### 4. 創建 Let's Encrypt 資料夾

```bash
cd deploy
mkdir -p letsencrypt
chmod 600 letsencrypt
```

#### 5. 啟動服務

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 6. 查看憑證申請狀態

```bash
# 查看 Traefik 日誌
docker-compose -f docker-compose.prod.yml logs -f traefik

# 成功的話會看到類似訊息：
# "Certificate obtained for domains [your-domain.com]"
```

#### 7. 測試 HTTPS

```bash
# 訪問你的網站（會自動從 HTTP 重定向到 HTTPS）
curl -I https://your-domain.com

# 應該返回 200 OK
```

### Staging vs Production 環境

#### Staging（測試環境）

- ✅ **優點**：
  - Rate limit 較寬鬆（每小時可申請數百次）
  - 適合測試和除錯
  - 可以無限重試

- ❌ **缺點**：
  - 瀏覽器會顯示憑證不受信任（因為是測試憑證）
  - 需要手動接受安全例外才能訪問

- **何時使用**：首次設定、測試配置、除錯問題

#### Production（正式環境）

- ✅ **優點**：
  - 真實的 SSL 憑證
  - 瀏覽器完全信任
  - 用戶不會看到任何警告

- ❌ **缺點**：
  - Rate limit 嚴格（每週最多 50 次失敗嘗試）
  - 如果配置錯誤，可能被暫時封鎖

- **何時使用**：確認一切正常後才切換

### 從 Staging 切換到 Production

當你在 Staging 環境測試成功後：

```bash
cd deploy

# 1. 停止服務
docker-compose -f docker-compose.prod.yml down

# 2. 清除 staging 憑證
rm -rf letsencrypt/*

# 3. 修改 .env
nano .env
```

更改以下設定：

```bash
ACME_ENV=production
ACME_CA_SERVER=https://acme-v02.api.letsencrypt.org/directory
```

```bash
# 4. 重新啟動
docker-compose -f docker-compose.prod.yml up -d

# 5. 查看日誌確認
docker-compose -f docker-compose.prod.yml logs -f traefik
```

### HTTPS 相關問題排查

#### Q1: 無法取得憑證

**檢查清單**：

```bash
# 1. 確認域名解析正確
nslookup your-domain.com

# 2. 確認 port 80 開放（Let's Encrypt 需要）
sudo netstat -tuln | grep :80

# 3. 確認防火牆設定
sudo ufw status  # Ubuntu/Debian
sudo firewall-cmd --list-all  # CentOS/RHEL

# 4. 查看 Traefik 錯誤訊息
docker-compose -f docker-compose.prod.yml logs traefik | grep -i error
```

#### Q2: 瀏覽器顯示憑證不受信任

這是正常的，如果你使用的是 **Staging 環境**。

解決方法：
1. 確認配置正確後，切換到 Production 環境（見上方說明）
2. 或在瀏覽器中手動接受憑證（僅用於測試）

#### Q3: Rate limit 錯誤

```
too many certificates already issued for exact set of domains
```

**原因**：超過 Let's Encrypt 的 rate limit

**解決方法**：
1. 如果是測試，使用 Staging 環境
2. 等待一週後重試
3. 檢查是否有重複的憑證申請

#### Q4: HTTP 無法自動重定向到 HTTPS

```bash
# 檢查 Traefik 的重定向設定
docker exec waterball-lms-traefik cat /etc/traefik/traefik.yml

# 確認 .env 中 ENABLE_HTTPS=true
cat .env | grep ENABLE_HTTPS
```

### 免費域名服務推薦

#### 1. DuckDNS（最推薦新手）

- **優點**：完全免費、設定簡單、支援動態 IP
- **限制**：子域名（yourname.duckdns.org）
- **網址**：https://www.duckdns.org

**設定步驟**：
```bash
# 1. 訪問 duckdns.org 並登入
# 2. 創建子域名（例如：myapp）
# 3. 設定 IP 為你的伺服器 IP

# 4. （可選）設定自動更新 IP 的 cron job
echo "*/5 * * * * curl https://www.duckdns.org/update?domains=myapp&token=YOUR_TOKEN" | crontab -
```

#### 2. Freenom

- **優點**：免費頂級域名（.tk, .ml, .ga 等）
- **限制**：需要定期續約、可能被收回
- **網址**：https://www.freenom.com

#### 3. NoIP

- **優點**：動態 DNS、免費子域名
- **限制**：免費版需要每月確認一次
- **網址**：https://www.noip.com

### 憑證自動更新

Let's Encrypt 憑證有效期為 90 天。Traefik 會**自動更新**憑證，你不需要手動操作。

檢查自動更新：

```bash
# 查看憑證資訊
docker exec waterball-lms-traefik cat /letsencrypt/acme.json | jq

# 檢查 Traefik 日誌中的更新訊息
docker-compose -f docker-compose.prod.yml logs traefik | grep -i renew
```

---

## 📦 部署步驟

### 1. 準備環境變數

```bash
cd deploy
cp .env.example .env
nano .env
```

**確保修改以下變數**：
- ✅ `DOMAIN` → 你的伺服器 IP 或域名
- ✅ `DATABASE_PASSWORD` → 強密碼
- ✅ `JWT_SECRET` → 使用 `openssl rand -base64 32` 生成

### 2. 啟動服務

```bash
# 啟動所有服務（背景執行）
docker-compose -f docker-compose.prod.yml up -d

# 首次啟動會進行建置，大約需要 5-10 分鐘
# 可以查看建置進度
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. 等待服務啟動

```bash
# 查看所有服務狀態
docker-compose -f docker-compose.prod.yml ps

# 應顯示所有服務為 "Up (healthy)"
# NAME                          STATUS
# waterball-lms-traefik         Up
# waterball-lms-frontend-prod   Up (healthy)
# waterball-lms-backend-prod    Up (healthy)
# waterball-lms-db-prod         Up (healthy)
```

### 4. 查看日誌（可選）

```bash
# 查看所有服務日誌
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服務日誌
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f traefik
```

---

## ✅ 驗證部署

### 1. 檢查服務狀態

```bash
# 查看服務狀態
docker-compose -f docker-compose.prod.yml ps

# 所有服務應顯示 "Up" 或 "Up (healthy)"
```

### 2. 測試 Backend API

```bash
# 測試 Backend Health Check
curl http://YOUR_IP/api/health

# 應回傳 200 OK 或類似成功訊息
```

### 3. 測試 Frontend

```bash
# 測試前端首頁
curl http://YOUR_IP

# 應回傳 HTML 內容
```

### 4. 在瀏覽器中訪問

開啟瀏覽器，訪問：
- **Frontend**: `http://YOUR_IP`
- **Backend API Docs** (Swagger): `http://YOUR_IP/api/swagger-ui.html`

### 5. 檢查 Traefik 路由（可選）

如果啟用了 Traefik Dashboard：

```bash
# 在 .env 中設定
TRAEFIK_DASHBOARD=true
TRAEFIK_DASHBOARD_PORT=8081

# 重啟服務
docker-compose -f docker-compose.prod.yml restart traefik

# 訪問 Dashboard
# http://YOUR_IP:8081/dashboard/
```

---

## 🔧 常用操作

### 停止服務

```bash
# 停止所有服務
docker-compose -f docker-compose.prod.yml down

# 停止並刪除 volumes（會清空資料庫！）
docker-compose -f docker-compose.prod.yml down -v
```

### 重新啟動服務

```bash
# 重新啟動所有服務
docker-compose -f docker-compose.prod.yml restart

# 重新啟動特定服務
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart backend
```

### 更新部署

```bash
# 1. 拉取最新程式碼
git pull

# 2. 重新建置並啟動
cd deploy
docker-compose -f docker-compose.prod.yml up -d --build

# 3. 查看日誌確認
docker-compose -f docker-compose.prod.yml logs -f
```

### 查看資源使用情況

```bash
# 查看容器資源使用
docker stats

# 查看映像檔大小
docker images | grep waterball
```

---

## 🐛 常見問題

### Q1: 無法訪問服務（連線被拒絕）

**可能原因**：
1. 防火牆阻擋了 port 80
2. 服務尚未啟動完成

**解決方法**：

```bash
# 1. 檢查防火牆（Ubuntu/Debian）
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw reload

# 2. 檢查防火牆（CentOS/RHEL）
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload

# 3. 確認服務狀態
docker-compose -f docker-compose.prod.yml ps

# 4. 查看日誌
docker-compose -f docker-compose.prod.yml logs -f
```

### Q2: Frontend 無法連接到 Backend

**檢查清單**：

```bash
# 1. 確認 .env 中的 DOMAIN 設定正確
cat .env | grep DOMAIN

# 2. 檢查 Backend 健康狀態
curl http://YOUR_IP/api/health

# 3. 查看 Frontend 環境變數
docker exec waterball-lms-frontend-prod printenv | grep API

# 4. 檢查 Backend CORS 設定
docker-compose -f docker-compose.prod.yml logs backend | grep CORS
```

### Q3: 資料庫連線失敗

**檢查方法**：

```bash
# 1. 確認資料庫健康狀態
docker-compose -f docker-compose.prod.yml ps postgres

# 2. 測試資料庫連線
docker exec waterball-lms-db-prod psql -U wblms_user -d waterball_lms -c "SELECT 1;"

# 3. 查看資料庫日誌
docker-compose -f docker-compose.prod.yml logs postgres

# 4. 確認環境變數
cat .env | grep DATABASE
```

### Q4: Traefik 路由無法正常運作

**檢查方法**：

```bash
# 1. 查看 Traefik 日誌
docker-compose -f docker-compose.prod.yml logs traefik

# 2. 檢查 Traefik 是否能偵測到服務
docker logs waterball-lms-traefik | grep "Provider"

# 3. 啟用 Traefik Dashboard 檢查路由
# 修改 .env: TRAEFIK_DASHBOARD=true
docker-compose -f docker-compose.prod.yml restart traefik

# 訪問: http://YOUR_IP:8081/dashboard/
```

### Q5: Port 被佔用

**錯誤訊息**：
```
Error: port is already allocated
```

**解決方法**：

```bash
# 檢查 port 80 佔用
sudo lsof -i :80

# 停止佔用的服務（例如 Apache/Nginx）
sudo systemctl stop apache2  # Ubuntu/Debian
sudo systemctl stop httpd    # CentOS/RHEL
sudo systemctl stop nginx

# 或修改 docker-compose.prod.yml 使用其他 port
# 將 traefik 的 ports 改為 "8080:80"
```

### Q6: 服務健康檢查失敗

```bash
# 查看失敗的服務
docker-compose -f docker-compose.prod.yml ps

# 檢查容器內部健康檢查
docker exec waterball-lms-backend-prod wget --no-verbose --tries=1 --spider http://localhost:8080/api/health

# 進入容器內部檢查
docker exec -it waterball-lms-backend-prod sh
```

---

## 🔐 安全性建議

### 1. 修改所有預設密碼

```bash
# 資料庫密碼
DATABASE_PASSWORD=use-strong-password-here

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
```

### 2. 限制 Traefik Dashboard 訪問

如果啟用 Dashboard，建議：
- 僅在需要時啟用
- 使用防火牆限制訪問 IP
- 設定認證機制

### 3. 使用 HTTPS（建議）

參考 [進階配置 - SSL/TLS 設定](#ssltls-設定)

### 4. 定期更新映像檔

```bash
# 更新基礎映像檔
docker-compose -f docker-compose.prod.yml pull

# 重新建置
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🚀 進階配置

### SSL/TLS 設定

使用 Let's Encrypt 自動取得 SSL 憑證：

1. **修改 docker-compose.prod.yml**，新增 HTTPS entry point：

```yaml
traefik:
  command:
    - "--entrypoints.web.address=:80"
    - "--entrypoints.websecure.address=:443"
    - "--certificatesresolvers.letsencrypt.acme.email=your-email@example.com"
    - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - ./letsencrypt:/letsencrypt
```

2. **更新服務 labels**：

```yaml
backend:
  labels:
    - "traefik.http.routers.backend.rule=Host(`${DOMAIN}`) && PathPrefix(`/api`)"
    - "traefik.http.routers.backend.entrypoints=websecure"
    - "traefik.http.routers.backend.tls.certresolver=letsencrypt"

frontend:
  labels:
    - "traefik.http.routers.frontend.rule=Host(`${DOMAIN}`)"
    - "traefik.http.routers.frontend.entrypoints=websecure"
    - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
```

3. **修改 .env**：

```bash
PROTOCOL=https
```

### 資料庫備份

```bash
# 手動備份
docker exec waterball-lms-db-prod pg_dump -U wblms_user waterball_lms > backup_$(date +%Y%m%d).sql

# 設定自動備份（crontab）
crontab -e

# 新增每日凌晨 2 點自動備份
0 2 * * * docker exec waterball-lms-db-prod pg_dump -U wblms_user waterball_lms > ~/backups/waterball_lms_$(date +\%Y\%m\%d).sql
```

### 監控和日誌

**使用 Docker Logging Driver**：

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 📊 效能優化

### 1. 調整資料庫連線池

在 Backend 環境變數中新增：

```yaml
backend:
  environment:
    SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE: 20
    SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE: 5
```

### 2. 啟用 Next.js 快取

確保 frontend 正確使用 standalone 模式（已在 Dockerfile 中配置）

### 3. 使用 Traefik 壓縮

在 traefik 中啟用 GZIP 壓縮：

```yaml
traefik:
  command:
    - "--entrypoints.web.http.middlewares=compress@docker"
    - "--experimental.plugins.compress.modulename=github.com/traefik/plugin-compress"
```

---

## 📚 相關文檔

- [Docker Compose 文檔](https://docs.docker.com/compose/)
- [Traefik 文檔](https://doc.traefik.io/traefik/)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Spring Boot Docker 指南](https://spring.io/guides/topicals/spring-boot-docker)

---

## 🆘 技術支援

如有問題，請檢查：

1. **服務日誌**: `docker-compose -f docker-compose.prod.yml logs -f [service_name]`
2. **服務狀態**: `docker-compose -f docker-compose.prod.yml ps`
3. **健康檢查**: `curl http://YOUR_IP/api/health`
4. **網路連通性**: `docker network inspect waterball-lms-network-prod`

---

**文件版本**: v2.0
**更新日期**: 2025-11-23
**適用版本**: docker-compose.prod.yml
