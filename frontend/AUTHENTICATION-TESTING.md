# 認證系統測試指南

## 🚀 前置準備

### 1. 啟動後端服務

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
```

後端應運行在 `http://localhost:8080`

### 2. 啟動前端服務

```bash
cd frontend
npm install
npm run dev
```

前端應運行在 `http://localhost:3000`

### 3. 確認環境變數

確認 `frontend/.env.local` 存在且包含：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_USE_REAL_API=true
```

---

## ✅ 測試場景

### 場景 1：註冊新帳號

1. 訪問 http://localhost:3000/sign-in
2. 點擊「註冊」Tab
3. 輸入以下資訊：
   - Email: `test@example.com`
   - 密碼: `test1234`
   - 顯示名稱: `測試用戶`
4. 點擊「註冊」按鈕

**預期結果**：
- ✅ 顯示成功訊息「註冊成功！歡迎加入 Waterball 學院」
- ✅ 自動跳轉到首頁 (`/`)
- ✅ 頂部導航欄顯示用戶名稱和頭像
- ✅ localStorage 中儲存 `accessToken`

**驗證方式**：
```javascript
// 在瀏覽器 Console 執行
localStorage.getItem('accessToken')
// 應返回 JWT token 字串
```

---

### 場景 2：登入現有帳號

1. 訪問 http://localhost:3000/sign-in
2. 確保在「登入」Tab
3. 輸入已註冊的帳號：
   - Email: `test@example.com`
   - 密碼: `test1234`
4. 點擊「登入」按鈕

**預期結果**：
- ✅ 顯示成功訊息「登入成功！」
- ✅ 自動跳轉到首頁
- ✅ 用戶狀態正確顯示

---

### 場景 3：驗證錯誤 - Email 格式錯誤

1. 訪問登入頁面
2. 輸入無效的 email：`invalid-email`
3. 輸入密碼：`test1234`
4. 點擊登入

**預期結果**：
- ✅ 顯示錯誤訊息「請輸入有效的電子郵件格式」
- ✅ Email 輸入框顯示紅色邊框
- ✅ 不發送 API 請求

---

### 場景 4：驗證錯誤 - 密碼太短

1. 訪問註冊頁面
2. 輸入有效 email
3. 輸入密碼：`123`（少於 4 碼）
4. 點擊註冊

**預期結果**：
- ✅ 顯示錯誤訊息「密碼至少需要 4 個字元」
- ✅ 密碼輸入框顯示紅色邊框
- ✅ 不發送 API 請求

---

### 場景 5：驗證錯誤 - 顯示名稱太短

1. 訪問註冊頁面
2. 輸入有效 email 和密碼
3. 輸入顯示名稱：`A`（少於 2 字元）
4. 點擊註冊

**預期結果**：
- ✅ 顯示錯誤訊息「顯示名稱需為 2-50 字元」
- ✅ 顯示名稱輸入框顯示紅色邊框

---

### 場景 6：API 錯誤 - 重複 Email

1. 使用已註冊的 email 再次註冊
2. Email: `test@example.com`
3. 點擊註冊

**預期結果**：
- ✅ 顯示錯誤訊息「此電子郵件已被註冊，請直接登入」
- ✅ Toast 通知顯示錯誤

---

### 場景 7：API 錯誤 - 錯誤密碼

1. 訪問登入頁面
2. 使用正確的 email 但錯誤的密碼
3. Email: `test@example.com`
4. 密碼: `wrongpassword`

**預期結果**：
- ✅ 顯示錯誤訊息
- ✅ 不跳轉頁面
- ✅ 表單保持在登入頁

---

### 場景 8：登出功能

1. 確保已登入狀態
2. 點擊頂部導航欄的登出按鈕（或用戶選單中的登出）

**預期結果**：
- ✅ 清除用戶狀態
- ✅ 清除 localStorage 中的 token
- ✅ 跳轉到登入頁或首頁

**驗證方式**：
```javascript
localStorage.getItem('accessToken')
// 應返回 null
```

---

### 場景 9：Token 持久化

1. 註冊或登入成功
2. 重新整理頁面 (F5)

**預期結果**：
- ✅ 用戶狀態保持登入
- ✅ 自動呼叫 `/api/auth/me` 取得用戶資訊
- ✅ 不需要重新登入

---

### 場景 10：受保護頁面訪問

1. 登出狀態下訪問課程頁面 `/courses`
2. 訪問用戶資料頁 `/users/me/profile`

**預期結果**：
- ✅ 需要 JWT token 的 API 自動帶上 `Authorization: Bearer {token}`
- ✅ 如果未登入，某些功能可能受限

---

## 🔍 Debug 技巧

### 檢查 Network 請求

1. 打開 Chrome DevTools (F12)
2. 切換到 Network 標籤
3. 篩選 `Fetch/XHR`
4. 執行登入/註冊操作
5. 檢查以下請求：

**註冊請求**：
```
POST http://localhost:8080/api/auth/register
Request Body: {
  "email": "test@example.com",
  "password": "test1234",
  "displayName": "測試用戶"
}
Response: {
  "accessToken": "eyJhbGci...",
  "tokenType": "Bearer",
  "user": { ... }
}
```

**登入請求**：
```
POST http://localhost:8080/api/auth/login
Request Body: {
  "email": "test@example.com",
  "password": "test1234"
}
```

**取得用戶資訊**：
```
GET http://localhost:8080/api/auth/me
Headers: {
  "Authorization": "Bearer eyJhbGci..."
}
```

### 檢查 Console 錯誤

如果有錯誤，Console 會顯示詳細訊息：
- CORS 錯誤
- 網路錯誤
- API 錯誤回應

### 檢查 localStorage

```javascript
// 查看儲存的 token
localStorage.getItem('accessToken')

// 清除 token
localStorage.removeItem('accessToken')

// 清除所有資料
localStorage.clear()
```

---

## 🐛 常見問題

### 問題 1：CORS 錯誤

**錯誤訊息**：
```
Access to fetch at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**解決方案**：
確認後端 SecurityConfig 中的 CORS 設定包含 `http://localhost:3000`

### 問題 2：連線錯誤

**錯誤訊息**：
```
Failed to fetch
```

**解決方案**：
- 確認後端服務正在運行
- 確認後端運行在 `localhost:8080`
- 確認 `.env.local` 中的 API URL 正確

### 問題 3：Token 未儲存

**症狀**：
重新整理頁面後需要重新登入

**解決方案**：
檢查瀏覽器是否允許 localStorage（隱私模式可能禁用）

### 問題 4：型別錯誤

**錯誤訊息**：
```
TypeError: Cannot read property 'user' of undefined
```

**解決方案**：
檢查 API 回應格式是否符合預期

---

## 📊 測試檢查清單

完成以下測試項目：

- [ ] 可以註冊新帳號
- [ ] 可以登入現有帳號
- [ ] Email 格式驗證正確
- [ ] 密碼長度驗證正確
- [ ] 顯示名稱驗證正確
- [ ] 重複 email 顯示錯誤
- [ ] 錯誤密碼顯示錯誤
- [ ] JWT token 正確儲存
- [ ] 重新整理頁面後狀態保持
- [ ] 登出功能正常
- [ ] 受保護 API 自動帶上 token
- [ ] 錯誤訊息顯示友善

---

## 🎯 驗收標準

所有測試場景都應該通過，且：

1. ✅ UI 符合設計系統（使用 design tokens）
2. ✅ 響應式設計在 Mobile/Tablet/Desktop 正常
3. ✅ 無 Console 錯誤（除了預期的錯誤）
4. ✅ Loading 狀態正確顯示
5. ✅ 錯誤訊息清晰友善
6. ✅ 表單驗證即時反饋
7. ✅ Tab 切換流暢
8. ✅ 成功訊息使用 Toast 顯示

---

**測試完成後，請回報測試結果！** 🎉
