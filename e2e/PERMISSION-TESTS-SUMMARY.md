# Permission Testing Summary - From Non-User to Paid User

## 概述

本次新增了完整的權限測試套件，涵蓋從訪客（非用戶）到註冊用戶再到付費用戶的完整流程。

## 新增檔案

### 📦 Page Objects

#### 1. `pages/SignUpPage.ts`
完整的註冊/登入頁面物件，支援雙模式（登入/註冊）

**功能：**
- 切換登入/註冊分頁
- 註冊新用戶（email + password + displayName）
- 登入現有用戶
- 表單驗證檢查
- 等待 API 響應和導航

**關鍵方法：**
- `registerAndWaitForNavigation()` - 註冊並等待重定向
- `loginAndWaitForNavigation()` - 登入並等待重定向
- `isEmailInputInvalid()` - 檢查 email 驗證狀態
- `getAuthToken()` - 獲取認證 token

#### 2. `pages/PurchaseModal.ts`
課程購買模態框頁面物件

**功能：**
- 選擇支付方式（信用卡/ATM/行動支付）
- 勾選同意條款
- 確認/取消購買
- 完整的購買流程自動化

**關鍵方法：**
- `completePurchase(paymentMethod)` - 完成購買流程
- `isConfirmButtonEnabled()` - 檢查確認按鈕狀態
- `waitForModal()` - 等待模態框出現

### 🔧 修改的檔案

#### 3. `pages/CoursesPage.ts`
新增和改進的方法

**新增：**
- `hasPurchaseButton()` - 檢查課程是否有購買按鈕
- `hasOwnedBadge()` - 檢查是否顯示已擁有標記
- `clickPurchaseButton()` - 點擊購買按鈕

**改進：**
- `isCourseLocked()` - 增加錯誤處理，避免拋出異常
- `searchCourses()` - 改用 networkidle 替代硬編碼等待

#### 4. `helpers/auth-helpers.ts`
新增註冊和清理功能

**新增：**
- `register()` - 註冊新用戶
- `registerUser()` - 使用預定義測試用戶註冊
- `clearAuth()` - 清除認證狀態（不導航）

#### 5. `fixtures/test-users.ts`
支援動態用戶創建

**新增：**
- `generateRandomEmail()` - 生成唯一的測試 email
- `createTestUser()` - 動態創建測試用戶物件

### ✅ 測試檔案

#### 6. `tests/auth/signup.spec.ts` (10 個測試)
完整的註冊流程測試

**測試涵蓋：**
- ✅ 顯示註冊表單
- ✅ 成功註冊新用戶
- ✅ 無效 email 格式驗證
- ✅ 密碼少於 4 字元驗證
- ✅ displayName 少於 2 字元驗證
- ✅ displayName 超過 50 字元驗證
- ✅ 重複 email 註冊錯誤處理
- ✅ 空白欄位驗證
- ✅ 登入/註冊分頁切換
- ✅ 已認證用戶重定向
- ✅ 註冊狀態持久化

#### 7. `tests/auth/guest-access.spec.ts` (12 個測試)
訪客權限控制測試

**測試涵蓋：**
- ✅ 訪客可以瀏覽首頁
- ✅ 訪客可以瀏覽課程列表
- ✅ 訪客查看免費課程時顯示登入提示
- ✅ 訪客查看付費課程時顯示登入提示
- ✅ 點擊登入按鈕重定向到登入頁
- ✅ 訪客可以直接訪問登入頁
- ✅ 訪客沒有 auth token
- ✅ 訪客無法訪問影片播放器
- ✅ 顯示課程資訊但限制內容訪問
- ✅ 訪客訪問排行榜（依實現而定）
- ✅ 跨頁面保持訪客狀態
- ✅ 不顯示用戶專屬 UI 元素

#### 8. `tests/purchase/course-purchase-ui.spec.ts` (10 個測試)
課程購買 UI 流程測試

**測試涵蓋：**
- ✅ 付費課程顯示購買按鈕
- ✅ 免費課程不顯示購買按鈕
- ✅ 點擊購買按鈕打開模態框
- ✅ 模態框顯示正確的課程資訊
- ✅ 需要勾選同意條款才能購買
- ✅ 可以選擇不同支付方式
- ✅ 成功完成課程購買
- ✅ 購買後可以訪問課程內容
- ✅ 防止重複購買相同課程
- ✅ 可以取消購買
- ✅ 支援購買多個不同課程

#### 9. `tests/user-journeys/guest-to-paid-user.spec.ts` (4 個測試)
完整用戶旅程測試（從訪客到付費用戶）

**主要測試：**
- ✅ **完整流程**（10 步驟）：
  1. 訪客訪問網站
  2. 瀏覽課程
  3. 嘗試訪問免費課程（被阻擋）
  4. 點擊登入並註冊
  5. 訪問免費課程（成功）
  6. 嘗試訪問付費課程（看到購買提示）
  7. 購買付費課程
  8. 驗證購買成功
  9. 驗證可以訪問免費和付費課程
  10. 驗證認證狀態持久化

- ✅ 訪客瀏覽多個課程後再註冊
- ✅ 新用戶連續購買多個課程
- ✅ 購買後狀態在瀏覽器刷新後持久化

## 測試統計

### 新增測試數量
- 註冊流程：10 個測試
- 訪客權限：12 個測試
- 購買 UI 流程：10 個測試
- 完整用戶旅程：4 個測試
- **總計：36 個新測試**

### 加上原有測試
- 原有測試：26 個
- 新增測試：36 個
- **總測試數：62 個**

## 測試覆蓋率矩陣

| 用戶狀態 | 免費課程 | 付費課程 | 註冊 | 登入 | 購買 |
|---------|---------|---------|-----|-----|-----|
| 訪客 | ✅ 阻擋 | ✅ 阻擋 | ✅ 可以 | ✅ 可以 | ❌ 不可 |
| 註冊用戶（免費） | ✅ 可訪問 | ✅ 阻擋 | ✅ 已註冊 | ✅ 可以 | ✅ 可以 |
| 註冊用戶（已購買） | ✅ 可訪問 | ✅ 可訪問 | ✅ 已註冊 | ✅ 可以 | ✅ 可以 |

## 執行測試

### 執行所有新測試
```bash
# 註冊測試
npx playwright test tests/auth/signup.spec.ts

# 訪客權限測試
npx playwright test tests/auth/guest-access.spec.ts

# 購買 UI 測試
npx playwright test tests/purchase/course-purchase-ui.spec.ts

# 完整用戶旅程
npx playwright test tests/user-journeys/guest-to-paid-user.spec.ts
```

### 執行所有權限相關測試
```bash
npx playwright test tests/auth/
npx playwright test tests/purchase/
npx playwright test tests/user-journeys/guest-to-paid-user.spec.ts
```

## 關鍵改進

### 1. 錯誤處理
所有頁面物件方法都增加了適當的錯誤處理，使用 `try-catch` 和 `.catch(() => false)` 模式。

### 2. 等待策略
- 移除硬編碼的 `waitForTimeout`（除非必要）
- 使用 `waitForResponse` 等待 API 調用
- 使用 `waitForURL` 等待導航完成
- 使用 `waitForLoadState` 替代固定時間等待

### 3. 動態測試數據
- 使用 `createTestUser()` 動態生成測試用戶
- 每個測試使用唯一的 email 避免衝突
- 不再依賴預先存在的測試帳號

### 4. 真實用戶流程
- 測試模擬真實用戶的完整旅程
- 從訪客到註冊到購買的連貫流程
- 驗證每個步驟的狀態變化

## 注意事項

### 測試環境要求
1. 後端 API 必須運行在 `http://localhost:8080`
2. 前端必須運行在 `http://localhost:3001`（或配置的 BASE_URL）
3. 資料庫必須有測試課程數據（參考 `data.sql`）

### 已知限制
1. 購買模態框的選擇器可能需要根據實際實現調整
2. 某些測試使用 `waitForTimeout` 等待 UI 更新（可進一步優化）
3. 測試假設後端使用模擬支付（MOCK payment）

### 潛在問題排查

#### 測試失敗：「購買按鈕不可見」
- 檢查課程是否為付費課程（`isFree: false`）
- 檢查用戶是否已經購買過該課程
- 檢查前端實現的購買按鈕文字是否為「立即購買」

#### 測試失敗：「註冊後未重定向」
- 檢查前端註冊成功後的重定向邏輯
- 確認 API 返回 200 狀態碼
- 檢查 `accessToken` 是否正確儲存在 localStorage

#### 測試失敗：「模態框未出現」
- 檢查模態框是否使用 `role="dialog"` 屬性
- 確認購買按鈕點擊事件正確綁定
- 檢查瀏覽器控制台是否有 JavaScript 錯誤

## 後續建議

### 可以進一步添加的測試
1. 密碼重置流程
2. 電子郵件驗證流程（如果實現）
3. 社交登入（Google/Facebook 等，如果實現）
4. 多設備登入測試
5. Session 過期處理
6. 購買失敗處理（如果有真實支付整合）
7. 退款流程（如果實現）
8. 管理員權限測試

### 性能優化
1. 使用 Playwright 的並行執行（已支援）
2. 考慮使用 API 快速創建測試數據
3. 添加測試數據清理機制
4. 使用數據庫快照加速測試環境重置

## 總結

✅ **完成了從「非用戶到成為用戶」的完整權限測試**
✅ **36 個新測試涵蓋註冊、訪客權限、購買流程和完整用戶旅程**
✅ **所有測試使用動態生成的測試數據，確保獨立性**
✅ **改進了頁面物件的錯誤處理和等待策略**
✅ **測試邏輯清晰，易於維護和擴展**

現在您的 E2E 測試套件已經能夠完整驗證整個用戶生命週期，從訪客到註冊用戶再到付費用戶的所有關鍵流程！
