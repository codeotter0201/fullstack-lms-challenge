# HTTPS 設定功能總結

> Waterball LMS 現已支援使用 Let's Encrypt 免費 SSL 憑證！

---

## ✨ 新功能

### 1. 自動 HTTPS 配置
- ✅ 使用 **Traefik** 作為反向代理
- ✅ 自動向 **Let's Encrypt** 申請免費 SSL 憑證
- ✅ 自動處理憑證更新（90 天有效期，自動續期）
- ✅ HTTP 自動重定向到 HTTPS
- ✅ 支援 Staging（測試）和 Production（正式）環境

### 2. 簡化的配置流程
- ✅ 環境變數驅動配置（`.env` 檔案）
- ✅ 一鍵自動化腳本（`setup-https.sh`）
- ✅ 完整的文檔和故障排除指南
- ✅ 支援免費域名服務（DuckDNS、Freenom 等）

---

## 📦 新增/修改的檔案

### 核心配置檔案

1. **`deploy/.env.example`** ⭐ 更新
   - 新增 `DOMAIN` 變數（域名或 IP）
   - 新增 `ENABLE_HTTPS` 開關（true/false）
   - 新增 `ACME_EMAIL`（Let's Encrypt 通知 email）
   - 新增 `ACME_ENV`（staging/production）
   - 新增 `ACME_CA_SERVER`（Let's Encrypt 伺服器 URL）

2. **`deploy/docker-compose.prod.yml`** ⭐ 大幅更新
   - 新增 **Traefik** 服務（反向代理）
   - 新增 **Frontend** 服務
   - 配置 Let's Encrypt ACME 支援
   - 配置 HTTP → HTTPS 自動重定向
   - 動態 CORS 配置（根據 DOMAIN 自動設定）
   - 支援 port 80 (HTTP) 和 443 (HTTPS)

### 輔助工具

3. **`deploy/setup-https.sh`** ⭐ 新增
   - 自動化 HTTPS 設定腳本
   - 驗證域名配置
   - 交互式配置引導
   - 自動更新 `.env` 檔案
   - 創建必要的目錄和權限

### 文檔

4. **`deploy/PRODUCTION-DEPLOYMENT.md`** ⭐ 重大更新
   - 新增完整的 HTTPS 設定章節
   - 免費域名服務推薦（DuckDNS、Freenom、NoIP）
   - Staging vs Production 環境說明
   - 詳細的故障排除指南
   - 憑證自動更新說明

5. **`deploy/HTTPS-QUICKSTART.md`** ⭐ 新增
   - 5 分鐘快速入門指南
   - 逐步操作說明
   - 常見問題快速解答

6. **`deploy/README.md`** ⭐ 更新
   - 新增 HTTPS 快速設定章節
   - 更新檔案說明表格
   - 新增免費域名推薦連結

7. **`.gitignore`** ⭐ 更新
   - 忽略 `deploy/.env`（避免洩漏敏感資訊）
   - 忽略 `deploy/letsencrypt/`（SSL 憑證資料）

---

## 🏗️ 架構變更

### 原架構（僅 HTTP）

```
外部用戶
  ↓
http://IP:3000 (Frontend)
http://IP:8080 (Backend)
```

**問題**：
- ❌ 前端容器內使用 `http://backend:8080` 無法被外部訪問
- ❌ 需要暴露多個端口
- ❌ 無 HTTPS 支援

### 新架構（HTTP + HTTPS 支援）

```
外部用戶
  ↓
http://DOMAIN:80 或 https://DOMAIN:443
  ↓
Traefik (反向代理)
  ├─ /     → Frontend:3000
  └─ /api  → Backend:8080
              ↓
          PostgreSQL:5432
```

**優點**：
- ✅ 統一入口點（僅需開放 port 80/443）
- ✅ 自動 HTTPS 和憑證管理
- ✅ HTTP 自動重定向到 HTTPS
- ✅ 路徑路由（/api 到後端，其他到前端）
- ✅ 動態 CORS 配置

---

## 🚀 使用方式

### 方法一：僅 HTTP（使用 IP）

```bash
cd deploy
cp .env.example .env
nano .env  # 設定 DOMAIN=192.168.1.100

docker-compose -f docker-compose.prod.yml up -d
```

訪問：`http://192.168.1.100`

### 方法二：HTTPS（需要域名）

```bash
cd deploy
cp .env.example .env
nano .env  # 設定 DOMAIN、ENABLE_HTTPS=true、ACME_EMAIL

# 使用自動化腳本
./setup-https.sh

# 或手動啟動
docker-compose -f docker-compose.prod.yml up -d
```

訪問：`https://your-domain.com`

---

## 🔑 關鍵環境變數

### 必須設定

| 變數 | 說明 | 範例 |
|------|------|------|
| `DOMAIN` | 域名或 IP | `myapp.duckdns.org` |
| `DATABASE_PASSWORD` | 資料庫密碼 | `強密碼` |
| `JWT_SECRET` | JWT 密鑰 | `openssl rand -base64 32` |

### HTTPS 相關（可選）

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `ENABLE_HTTPS` | 啟用 HTTPS | `false` |
| `ACME_EMAIL` | Let's Encrypt email | - |
| `ACME_ENV` | staging/production | `staging` |
| `ACME_CA_SERVER` | ACME 伺服器 URL | staging URL |

---

## 📋 檢查清單

### 使用 HTTP（IP 位址）

- [x] 設定 `DOMAIN` 為 IP 位址
- [x] 設定 `DATABASE_PASSWORD`
- [x] 設定 `JWT_SECRET`
- [x] 執行 `docker-compose -f docker-compose.prod.yml up -d`

### 使用 HTTPS（域名）

- [x] 取得域名（免費或付費）
- [x] 設定 DNS A 記錄指向伺服器 IP
- [x] 開放防火牆 port 80 和 443
- [x] 設定 `DOMAIN` 為域名
- [x] 設定 `ENABLE_HTTPS=true`
- [x] 設定 `ACME_EMAIL`
- [x] 設定 `DATABASE_PASSWORD`
- [x] 設定 `JWT_SECRET`
- [x] 執行 `./setup-https.sh` 或手動啟動

---

## 🆘 故障排除

### 常見問題

1. **無法取得憑證**
   - 確認域名 DNS 正確解析
   - 確認 port 80/443 開放
   - 查看 Traefik 日誌：`docker-compose -f docker-compose.prod.yml logs traefik`

2. **瀏覽器顯示不安全**
   - 使用 staging 環境是正常的
   - 切換到 production 環境取得真實憑證

3. **Rate limit 錯誤**
   - 使用 staging 環境測試
   - production 環境有限制（每週 50 次）

4. **HTTP 無法重定向到 HTTPS**
   - 確認 `ENABLE_HTTPS=true`
   - 重啟 Traefik：`docker-compose -f docker-compose.prod.yml restart traefik`

詳細說明請參考：[PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)

---

## 📚 相關文檔

- **快速開始**：[HTTPS-QUICKSTART.md](./HTTPS-QUICKSTART.md) - 5 分鐘設定
- **完整指南**：[PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) - 詳細部署文檔
- **Docker 指南**：[DOCKER-GUIDE.md](./DOCKER-GUIDE.md) - Docker 使用說明
- **主要 README**：[README.md](./README.md) - 快速參考

---

## 🎉 功能亮點

### 自動化程度高
- 一鍵腳本設定
- 憑證自動申請和更新
- HTTP 自動重定向

### 安全性
- 免費 SSL 憑證
- 自動更新（永不過期）
- HTTPS 加密傳輸

### 彈性配置
- 支援 HTTP 和 HTTPS
- 支援 IP 和域名
- 測試環境（staging）和正式環境（production）

### 完整文檔
- 詳細的設定指南
- 故障排除說明
- 免費域名推薦

---

**更新日期**: 2025-11-23
**版本**: v2.0 - HTTPS Support
