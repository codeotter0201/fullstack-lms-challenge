# HTTPS 快速入門指南

> 5 分鐘內為你的 Waterball LMS 設定免費 HTTPS！

---

## 🎯 快速步驟

### 1. 取得免費域名（2 分鐘）

推薦使用 **DuckDNS**（最簡單）：

1. 訪問 [https://www.duckdns.org](https://www.duckdns.org)
2. 用 Google/GitHub 帳號登入
3. 創建子域名（例如：`myapp`）
4. 設定 IP 為你的伺服器 IP
5. 你的域名：`myapp.duckdns.org` ✅

### 2. 配置環境變數（1 分鐘）

```bash
cd deploy
cp .env.example .env
nano .env
```

最少需要設定：

```bash
# 你的 DuckDNS 域名
DOMAIN=myapp.duckdns.org

# 啟用 HTTPS
ENABLE_HTTPS=true

# 你的 Email
ACME_EMAIL=your-email@gmail.com

# 使用 staging 測試
ACME_ENV=staging
```

### 3. 開放防火牆（1 分鐘）

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### 4. 啟動服務（1 分鐘）

**方法 A：使用自動化腳本（推薦）**

```bash
./setup-https.sh
```

**方法 B：手動啟動**

```bash
mkdir -p letsencrypt
docker-compose -f docker-compose.prod.yml up -d
```

### 5. 驗證 HTTPS（30 秒）

```bash
# 查看日誌
docker-compose -f docker-compose.prod.yml logs -f traefik

# 看到這個訊息就成功了：
# "Certificate obtained for domains [myapp.duckdns.org]"

# 在瀏覽器訪問
# https://myapp.duckdns.org
```

---

## ⚠️ 重要提醒

### Staging vs Production

- **Staging**（測試）：
  - ✅ 適合首次設定
  - ✅ 無限制測試
  - ⚠️ 瀏覽器會顯示「不安全」（這是正常的！）

- **Production**（正式）：
  - ✅ 真實憑證，瀏覽器信任
  - ⚠️ 有 rate limit（每週最多 50 次失敗）
  - 建議在 staging 測試成功後才切換

### 切換到 Production

測試成功後：

```bash
# 1. 停止服務
docker-compose -f docker-compose.prod.yml down

# 2. 清除測試憑證
rm -rf letsencrypt/*

# 3. 修改 .env
ACME_ENV=production
ACME_CA_SERVER=https://acme-v02.api.letsencrypt.org/directory

# 4. 重新啟動
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🐛 常見問題

### Q: 無法取得憑證

**檢查**：
```bash
# 1. DNS 是否正確
nslookup myapp.duckdns.org

# 2. Port 80/443 是否開放
sudo netstat -tuln | grep -E ':(80|443)'

# 3. 查看錯誤訊息
docker-compose -f docker-compose.prod.yml logs traefik | grep -i error
```

### Q: 瀏覽器顯示不安全

**原因**：你使用的是 Staging 環境（測試憑證）

**解決**：確認一切正常後，切換到 Production 環境（見上方）

### Q: 已經有 IP 但沒有域名

**不能使用 HTTPS**！Let's Encrypt 需要真實域名。

**解決方法**：
1. 使用 DuckDNS 取得免費域名（見步驟 1）
2. 或購買域名（推薦用於正式環境）

---

## 📚 完整文檔

詳細說明請參考：
- [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) - 完整部署指南
- [README.md](./README.md) - Docker Compose 使用說明

---

## 🎉 完成！

現在你的網站已經有 HTTPS 保護了！

- 網站：`https://myapp.duckdns.org`
- API：`https://myapp.duckdns.org/api`

憑證會**自動更新**，你不需要做任何事 🚀
