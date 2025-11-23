# E2E 測試快速開始指南

## 🚀 快速執行測試

### 步驟 1: 啟動開發環境

```bash
cd deploy
docker-compose -f docker-compose.dev.yml up -d
```

### 步驟 2: 執行測試

```bash
cd e2e
npm test
```

測試會自動:
1. ✅ 檢查服務是否就緒 (前端、後端、資料庫)
2. ✅ 執行所有測試
3. ✅ 產生測試報告

### 執行特定測試套件

```bash
# 購買功能測試
npm run test:purchase

# 認證測試
npm run test:auth

# 影片測試
npm run test:video

# 經驗值測試
npm run test:rewards
```

### 停止開發環境

測試完成後,手動停止環境:

```bash
cd deploy
docker-compose -f docker-compose.dev.yml down
```

## 🛠️ 進階用法

### 偵錯模式

```bash
# 顯示瀏覽器視窗
npm run test:headed

# UI 模式
npm run test:ui

# 逐步偵錯
npm run test:debug
```

## 📋 初次設定

首次使用需要安裝依賴:

```bash
cd e2e
npm install
npx playwright install --with-deps
cp .env.example .env
```

## 🐛 疑難排解

### 問題: Port 已被佔用

```bash
# 停止現有的 Docker 容器
cd deploy
docker-compose -f docker-compose.dev.yml down

# 或檢查 port 使用情況
lsof -i :3000
lsof -i :8080
lsof -i :5432
```

### 問題: 服務無法啟動

```bash
# 查看 Docker logs
cd deploy
docker-compose -f docker-compose.dev.yml logs

# 重新啟動
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### 問題: 測試超時

```bash
# 檢查服務狀態
cd deploy
docker-compose -f docker-compose.dev.yml ps

# 檢查後端健康狀態
curl http://localhost:8080/api/health

# 檢查前端
curl http://localhost:3000
```

## 🎯 常用指令速查

| 指令 | 說明 |
|------|------|
| `npm test` | 執行所有測試 |
| `npm run test:purchase` | 只執行購買測試 |
| `npm run test:headed` | 顯示瀏覽器視窗 |
| `npm run test:ui` | UI 模式 |
| `npm run test:debug` | 偵錯模式 |
| `npm run report` | 查看測試報告 |

## 📊 查看測試報告

測試結束後:

```bash
npm run report
# 或
npx playwright show-report
```

報告包含:
- ✅ 測試通過/失敗統計
- 📸 失敗測試的截圖
- 🎥 失敗測試的錄影
- 📝 詳細的執行追蹤

## 💡 最佳實踐

1. **首次執行**: 啟動開發環境後,先檢查服務狀態再執行測試
2. **快速測試**: 使用 `npm run test:purchase` 只執行你關心的測試
3. **偵錯失敗**: 使用 `npm run test:headed` 看到實際瀏覽器操作
4. **開發流程**: 讓開發環境保持運行,可重複執行測試不需要重啟

## 🔧 環境變數

在 `.env` 檔案設定 (通常使用預設值即可):

```bash
# 前端 URL (開發環境預設 port)
BASE_URL=http://localhost:3000

# 後端 API URL (開發環境預設 port)
API_URL=http://localhost:8080
```

## 📚 更多資訊

- 完整文件: [README.md](./README.md)
- 測試撰寫: 查看 `tests/` 目錄範例
- Page Objects: 查看 `pages/` 目錄
- Helper 函式: 查看 `helpers/` 目錄
