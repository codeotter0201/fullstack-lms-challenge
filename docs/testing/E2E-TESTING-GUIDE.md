# E2E Testing Guide - Waterball LMS

## Overview

本專案採用 **Playwright** 進行端到端測試,確保前後端整合的完整功能運作正常。

## 測試架構

### 目錄結構

```
fullstack-lms-challenge/
├── e2e/                          # E2E 測試根目錄
│   ├── tests/                    # 測試檔案 (按功能組織)
│   │   ├── auth/                # 登入、註冊、權限測試
│   │   ├── video/               # 影片播放、進度追蹤
│   │   ├── rewards/             # 經驗值、升級測試
│   │   └── user-journeys/       # 完整用戶流程測試
│   ├── pages/                   # Page Object Models
│   ├── fixtures/                # 測試資料
│   ├── helpers/                 # 測試輔助函式
│   ├── config/                  # 測試設定
│   └── scripts/                 # 測試執行腳本
├── deploy/
│   └── docker-compose.e2e.yml   # E2E 測試環境配置
└── .github/workflows/
    └── e2e-tests.yml            # CI/CD 自動化測試

```

### 測試環境

E2E 測試使用獨立的 Docker 環境:

- **Frontend (測試)**: `http://localhost:3001`
- **Backend (測試)**: `http://localhost:8081`
- **Database (測試)**: PostgreSQL on port `5433`

所有測試服務與開發環境完全隔離,避免資料污染。

## 快速開始

### 1. 安裝依賴

```bash
cd e2e
npm install
npx playwright install --with-deps
```

### 2. 執行測試

#### 方法 A: 使用便捷腳本 (推薦)

```bash
cd e2e
./scripts/run-tests.sh
```

腳本會自動:
1. 啟動 Docker 測試環境
2. 等待服務就緒
3. 執行 Playwright 測試
4. 產生測試報告
5. 清理測試環境

#### 方法 B: 手動執行

```bash
# 啟動測試環境
cd deploy
docker-compose -f docker-compose.e2e.yml up -d

# 等待服務啟動 (約 1-2 分鐘)
docker-compose -f docker-compose.e2e.yml ps

# 執行測試
cd ../e2e
npx playwright test

# 查看報告
npx playwright show-report

# 清理環境
cd ../deploy
docker-compose -f docker-compose.e2e.yml down -v
```

### 3. 針對本地開發環境測試

如果你已經在本地執行前後端,可以直接測試:

```bash
cd e2e
./scripts/run-tests-local.sh
```

## 測試覆蓋範圍

### 1. 認證測試 (`tests/auth/`)

- ✅ 登入流程 (成功/失敗案例)
- ✅ 表單驗證
- ✅ 權限控制 (免費/付費用戶)
- ✅ Session 持久化

### 2. 影片播放測試 (`tests/video/`)

- ✅ 影片載入與顯示
- ✅ 播放/暫停功能
- ✅ 進度條更新
- ✅ Seek 功能

### 3. 進度追蹤測試 (`tests/video/`)

- ✅ 自動儲存進度 (每 10 秒)
- ✅ 斷點續播
- ✅ 進度準確性
- ✅ 完成度偵測 (95%+)

### 4. 經驗值與升級測試 (`tests/rewards/`)

- ✅ 完成影片獲得 200 XP
- ✅ 防止重複交付獲得 XP
- ✅ 等級提升通知
- ✅ XP 進度條顯示
- ✅ 跨頁面資料持久化

### 5. 用戶完整流程測試 (`tests/user-journeys/`)

- ✅ 免費用戶完整流程
- ✅ 付費用戶完整流程
- ✅ 手機版測試

## 測試指令

### 執行所有測試

```bash
npm test
```

### 執行特定測試套件

```bash
npm run test:auth      # 僅認證測試
npm run test:video     # 僅影片測試
npm run test:rewards   # 僅經驗值測試
```

### 不同瀏覽器測試

```bash
npm run test:chrome    # Chrome
npm run test:firefox   # Firefox
npm run test:safari    # Safari
npm run test:mobile    # 行動裝置模擬
```

### 偵錯模式

```bash
npm run test:headed    # 顯示瀏覽器視窗
npm run test:debug     # 逐步偵錯
npm run test:ui        # UI 模式
```

### 執行單一測試檔案

```bash
npx playwright test tests/auth/login.spec.ts
```

## 撰寫測試

### 基本測試結構

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('功能名稱', () => {
  test.beforeEach(async ({ page }) => {
    // 每個測試前的設定
  });

  test('應該執行某個功能', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
  });
});
```

### 使用 Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// 使用
const loginPage = new LoginPage(page);
await loginPage.login('user@test.com', 'password');
```

### 使用測試資料 Fixtures

```typescript
import { testUsers } from '../../fixtures/test-users';
import { testCourses } from '../../fixtures/test-courses';

const freeUser = testUsers.freeUser;
const paidCourse = testCourses.find(c => !c.isFree);
```

### 使用輔助函式

```typescript
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { waitForAPIResponse } from '../../helpers/api-helpers';

await loginAsPaidUser(page);
const response = await waitForAPIResponse(page, '/api/progress');
```

## CI/CD 整合

測試會在以下情況自動執行:

- Push 到 `main` 或 `develop` 分支
- 建立 Pull Request 到 `main` 或 `develop`
- 手動觸發 GitHub Actions workflow

### 查看測試結果

1. 前往 GitHub Actions 標籤
2. 點擊 workflow run
3. 下載 artifacts:
   - `playwright-report` - HTML 測試報告
   - `test-results` - 測試結果 (JSON)
   - `test-videos` - 失敗測試的錄影

## 故障排除

### 服務無法啟動

```bash
# 查看服務日誌
cd deploy
docker-compose -f docker-compose.e2e.yml logs

# 重置環境
docker-compose -f docker-compose.e2e.yml down -v
docker-compose -f docker-compose.e2e.yml up -d
```

### Port 衝突

```bash
# 檢查 port 使用情況
lsof -i :3001
lsof -i :8081
lsof -i :5433

# 停止測試環境
cd deploy
docker-compose -f docker-compose.e2e.yml down -v
```

### 測試超時

1. 增加 timeout 設定 (playwright.config.ts):
   ```typescript
   timeout: 60 * 1000, // 60 秒
   ```

2. 保持環境運行以便偵錯:
   ```bash
   KEEP_ENV=true ./scripts/run-tests.sh
   ```

### Flaky Tests

1. 增加重試次數:
   ```typescript
   test.describe.configure({ retries: 2 });
   ```

2. 使用更穩定的 selector:
   ```typescript
   // 好的做法
   page.locator('[data-testid="submit-button"]')

   // 避免
   page.locator('.btn-primary')
   ```

## 測試最佳實踐

1. **使用 Page Object Models**: 封裝頁面互動邏輯
2. **使用 Helper Functions**: 提取共用操作
3. **使用 Fixtures**: 使用測試資料而非硬編碼
4. **描述性命名**: 測試名稱要清楚描述測試內容
5. **獨立測試**: 每個測試應該獨立且可重複執行
6. **自動等待**: 使用 Playwright 的內建等待機制
7. **避免硬等待**: 盡量使用 `waitFor` 而非 `waitForTimeout`

## 測試資料管理

### 測試用戶

```typescript
// fixtures/test-users.ts
export const testUsers = {
  freeUser: {
    email: 'free-user@test.com',
    password: 'Test123456!',
    displayName: 'Free Test User',
    isPremium: false,
  },
  paidUser: {
    email: 'paid-user@test.com',
    password: 'Test123456!',
    displayName: 'Paid Test User',
    isPremium: true,
  },
};
```

### 測試課程

```typescript
// fixtures/test-courses.ts
export const testCourses = [
  {
    id: 1,
    name: 'Software Design Patterns',
    slug: 'software-design-pattern',
    isFree: false,
  },
  {
    id: 2,
    name: 'Introduction to Programming',
    slug: 'intro-to-programming',
    isFree: true,
  },
];
```

## 環境變數

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `TEST_ENV` | 測試環境 (local, ci, staging, prod) | `local` |
| `BASE_URL` | 前端 URL | `http://localhost:3001` |
| `API_URL` | 後端 API URL | `http://localhost:8081` |
| `HEADED` | 顯示瀏覽器視窗 | `false` |
| `TIMEOUT` | 測試超時時間 (ms) | `30000` |
| `KEEP_ENV` | 測試後保持 Docker 環境運行 | `false` |

## 參考資源

- [Playwright 官方文件](https://playwright.dev/)
- [E2E README](../../e2e/README.md)
- [Docker Compose E2E 配置](../../deploy/docker-compose.e2e.yml)
- [GitHub Actions Workflow](../../.github/workflows/e2e-tests.yml)

## 支援

遇到問題或有疑問:

1. 查看 [E2E README](../../e2e/README.md)
2. 在 repository 建立 issue
3. 聯繫開發團隊
