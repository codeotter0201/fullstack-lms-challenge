# API 使用範例

## 認證相關 API

### 1. 註冊新用戶

**端點**: `POST /api/auth/register`

**請求範例**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "displayName": "測試學生"
  }'
```

**回應範例**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "displayName": "測試學生",
    "avatarUrl": null,
    "role": "STUDENT",
    "level": 1,
    "experience": 0,
    "isPremium": false
  }
}
```

---

### 2. 用戶登入

**端點**: `POST /api/auth/login`

**請求範例**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

**回應範例**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "student@example.com",
    "displayName": "測試學生",
    "avatarUrl": null,
    "role": "STUDENT",
    "level": 1,
    "experience": 0,
    "isPremium": false
  }
}
```

---

### 3. 取得當前用戶資訊

**端點**: `GET /api/auth/me`

**需要 JWT Token**

**請求範例**:
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**回應範例**:
```json
{
  "id": 1,
  "email": "student@example.com",
  "displayName": "測試學生",
  "avatarUrl": null,
  "role": "STUDENT",
  "level": 1,
  "experience": 0,
  "isPremium": false
}
```

---

## 測試帳號 (開發環境)

可以使用以下指令建立測試帳號:

### 免費學員帳號
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student-free@example.com",
    "password": "password123",
    "displayName": "免費學員"
  }'
```

### 付費學員帳號
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student-paid@example.com",
    "password": "password123",
    "displayName": "付費學員"
  }'
```

**注意**: 註冊後需要手動在資料庫將 `is_premium` 設為 `true`

---

## 健康檢查

**端點**: `GET /api/health`

**請求範例**:
```bash
curl http://localhost:8080/api/health
```

**回應範例**:
```json
{
  "status": "UP",
  "timestamp": "2025-11-18T10:30:00",
  "service": "Waterball LMS API"
}
```

---

## 使用 Swagger UI 測試

訪問 http://localhost:8080/swagger-ui.html 可以使用視覺化介面測試所有 API。

### 步驟:

1. 開啟 Swagger UI
2. 點擊 `POST /api/auth/register` 或 `POST /api/auth/login`
3. 點擊 "Try it out"
4. 輸入 JSON 請求內容
5. 點擊 "Execute"
6. 複製回應中的 `accessToken`
7. 點擊頁面右上角的 "Authorize" 按鈕
8. 輸入: `Bearer <your-token>`
9. 現在可以測試需要認證的 API

---

## 錯誤回應格式

所有錯誤都會回傳統一格式:

```json
{
  "timestamp": "2025-11-18T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already exists",
  "path": "/api/auth/register"
}
```

常見錯誤:
- `400 Bad Request` - 請求參數錯誤
- `401 Unauthorized` - 未登入或 Token 無效
- `403 Forbidden` - 無權限訪問
- `404 Not Found` - 資源不存在
- `500 Internal Server Error` - 伺服器錯誤

---

## 課程相關 API

### 4. 取得所有課程

**端點**: `GET /api/courses`

**需要 JWT Token**

**請求範例**:
```bash
curl -X GET http://localhost:8080/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**回應範例** (免費用戶):
```json
[
  {
    "id": 1,
    "title": "Java 基礎入門",
    "description": "從零開始學習 Java 程式設計",
    "thumbnailUrl": "https://example.com/java-basics.jpg",
    "isPremium": false,
    "totalLessons": 3,
    "displayOrder": 1
  }
]
```

**回應範例** (付費用戶):
```json
[
  {
    "id": 1,
    "title": "Java 基礎入門",
    "description": "從零開始學習 Java 程式設計",
    "thumbnailUrl": "https://example.com/java-basics.jpg",
    "isPremium": false,
    "totalLessons": 3,
    "displayOrder": 1
  },
  {
    "id": 2,
    "title": "Spring Boot 實戰",
    "description": "使用 Spring Boot 建立企業級應用",
    "thumbnailUrl": "https://example.com/spring-boot.jpg",
    "isPremium": true,
    "totalLessons": 2,
    "displayOrder": 2
  }
]
```

---

### 5. 取得課程的所有單元

**端點**: `GET /api/courses/{courseId}/lessons`

**需要 JWT Token**

**請求範例**:
```bash
curl -X GET http://localhost:8080/api/courses/1/lessons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**回應範例**:
```json
[
  {
    "id": 1,
    "courseId": 1,
    "title": "Java 環境安裝",
    "description": "學習如何安裝 JDK 和 IDE",
    "type": "VIDEO",
    "videoUrl": "https://www.youtube.com/watch?v=example1",
    "videoDuration": 600,
    "displayOrder": 1,
    "experienceReward": 200,
    "progressPercentage": 0,
    "lastPosition": 0,
    "isCompleted": false,
    "isSubmitted": false
  },
  {
    "id": 2,
    "courseId": 1,
    "title": "第一個 Java 程式",
    "description": "撰寫並執行第一個 Hello World",
    "type": "VIDEO",
    "videoUrl": "https://www.youtube.com/watch?v=example2",
    "videoDuration": 900,
    "displayOrder": 2,
    "experienceReward": 200,
    "progressPercentage": 50,
    "lastPosition": 450,
    "isCompleted": false,
    "isSubmitted": false
  }
]
```

---

### 6. 取得單元詳情

**端點**: `GET /api/courses/lessons/{lessonId}`

**需要 JWT Token**

**請求範例**:
```bash
curl -X GET http://localhost:8080/api/courses/lessons/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**回應範例**:
```json
{
  "id": 1,
  "courseId": 1,
  "title": "Java 環境安裝",
  "description": "學習如何安裝 JDK 和 IDE",
  "type": "VIDEO",
  "videoUrl": "https://www.youtube.com/watch?v=example1",
  "videoDuration": 600,
  "displayOrder": 1,
  "experienceReward": 200,
  "progressPercentage": 0,
  "lastPosition": 0,
  "isCompleted": false,
  "isSubmitted": false
}
```

---

## 學習進度相關 API

### 7. 更新學習進度

**端點**: `POST /api/progress/update`

**需要 JWT Token**

**說明**: 每 10 秒自動儲存影片播放進度

**請求範例**:
```bash
curl -X POST http://localhost:8080/api/progress/update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": 1,
    "position": 300,
    "duration": 600
  }'
```

**回應範例**:
```json
{
  "lessonId": 1,
  "progressPercentage": 50,
  "lastPosition": 300,
  "isCompleted": false,
  "isSubmitted": false
}
```

---

### 8. 交付單元 (獲得經驗值)

**端點**: `POST /api/progress/submit`

**需要 JWT Token**

**說明**: 完成單元後點擊小圈圈,獲得經驗值並可能升級

**請求範例**:
```bash
curl -X POST http://localhost:8080/api/progress/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": 1
  }'
```

**回應範例**:
```json
{
  "lessonId": 1,
  "experienceGained": 200,
  "isSubmitted": true,
  "user": {
    "id": 1,
    "email": "student@example.com",
    "displayName": "測試學生",
    "avatarUrl": null,
    "role": "STUDENT",
    "level": 2,
    "experience": 1200,
    "isPremium": false
  }
}
```

---

## 完整學習流程範例

```bash
# 1. 註冊/登入
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# 2. 取得課程列表
curl -s -X GET http://localhost:8080/api/courses \
  -H "Authorization: Bearer $TOKEN" | json_pp

# 3. 取得課程單元
curl -s -X GET http://localhost:8080/api/courses/1/lessons \
  -H "Authorization: Bearer $TOKEN" | json_pp

# 4. 開始觀看影片 - 每 10 秒更新進度
curl -s -X POST http://localhost:8080/api/progress/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1,"position":10,"duration":600}' | json_pp

# 5. 繼續更新進度...
curl -s -X POST http://localhost:8080/api/progress/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1,"position":600,"duration":600}' | json_pp

# 6. 完成後交付單元,獲得經驗值
curl -s -X POST http://localhost:8080/api/progress/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1}' | json_pp

# 7. 查看更新後的用戶資訊
curl -s -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | json_pp
```

---

**更新日期**: 2025-11-18
