#!/bin/bash

# ===========================================
# 水球軟體學院 LMS - E2E 測試腳本
# ===========================================
# 測試範圍:
# 1. 啟動完整服務 (PostgreSQL + Backend)
# 2. 等待服務就緒
# 3. 執行完整 API 測試流程
# 4. 驗證資料庫狀態
# 5. 清理環境 (可選)
# ===========================================

set -e  # 遇到錯誤立即退出

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
API_URL="${API_URL:-http://localhost:8080}"
MAX_WAIT=120  # 最多等待 120 秒
CLEANUP="${CLEANUP:-false}"  # 是否清理環境

# ===========================================
# 輔助函數
# ===========================================

print_header() {
    echo -e "${BLUE}=========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}=========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

wait_for_service() {
    local url=$1
    local service_name=$2
    local elapsed=0

    print_info "等待 $service_name 啟動..."

    while [ $elapsed -lt $MAX_WAIT ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$service_name 已就緒"
            return 0
        fi
        echo -n "."
        sleep 2
        elapsed=$((elapsed + 2))
    done

    print_error "$service_name 啟動超時"
    return 1
}

# ===========================================
# 1. 環境清理與啟動
# ===========================================

print_header "步驟 1: 啟動服務"

# 停止並清理現有容器
print_info "停止現有服務..."
docker-compose down -v

# 啟動服務
print_info "啟動 PostgreSQL 和 Backend..."
docker-compose up -d --build

# 等待資料庫就緒
print_info "等待資料庫初始化..."
sleep 5

# 等待 Backend 服務就緒
wait_for_service "$API_URL/api/health" "Backend API" || exit 1

echo ""

# ===========================================
# 2. 驗證 Flyway Migration
# ===========================================

print_header "步驟 2: 驗證 Flyway Migration"

# 檢查 flyway_schema_history 表
print_info "檢查 Flyway Migration 執行記錄..."
MIGRATION_COUNT=$(docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -t -c "SELECT COUNT(*) FROM flyway_schema_history WHERE success = true;")

if [ "$MIGRATION_COUNT" -ge 2 ]; then
    print_success "Flyway 已成功執行 $MIGRATION_COUNT 個 migration"
else
    print_error "Flyway migration 執行失敗"
    exit 1
fi

# 顯示 migration 記錄
print_info "Migration 執行記錄:"
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -c "SELECT installed_rank, version, description, type, installed_on, success FROM flyway_schema_history ORDER BY installed_rank;"

echo ""

# ===========================================
# 3. 驗證資料庫結構
# ===========================================

print_header "步驟 3: 驗證資料庫結構"

# 檢查資料表是否建立
TABLES=$(docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -t -c "\dt" | grep -c "public")

if [ "$TABLES" -ge 4 ]; then
    print_success "資料表建立成功 (共 $TABLES 張表)"
else
    print_error "資料表建立失敗"
    exit 1
fi

# 顯示資料表列表
print_info "資料表列表:"
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -c "\dt"

# 檢查測試資料
COURSE_COUNT=$(docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -t -c "SELECT COUNT(*) FROM courses;")
LESSON_COUNT=$(docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -t -c "SELECT COUNT(*) FROM lessons;")

print_info "課程數量: $COURSE_COUNT (預期: 2)"
print_info "單元數量: $LESSON_COUNT (預期: 5)"

if [ "$COURSE_COUNT" -eq 2 ] && [ "$LESSON_COUNT" -eq 5 ]; then
    print_success "測試資料驗證成功"
else
    print_error "測試資料驗證失敗"
    exit 1
fi

echo ""

# ===========================================
# 4. API 測試
# ===========================================

print_header "步驟 4: API 測試"

# 4.1 健康檢查
print_info "[4.1] 測試健康檢查端點"
HEALTH=$(curl -s "$API_URL/api/health")
if echo "$HEALTH" | grep -q "UP"; then
    print_success "健康檢查通過"
else
    print_error "健康檢查失敗"
    exit 1
fi

# 4.2 用戶註冊
print_info "[4.2] 測試用戶註冊"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "e2e-test@example.com",
    "password": "test123456",
    "displayName": "E2E 測試用戶"
  }')

TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    print_success "用戶註冊成功，Token 已取得"
else
    # 如果註冊失敗，嘗試登入
    print_info "用戶已存在，嘗試登入..."
    LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "e2e-test@example.com",
        "password": "test123456"
      }')
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

    if [ -n "$TOKEN" ]; then
        print_success "登入成功，Token 已取得"
    else
        print_error "無法取得 Token"
        exit 1
    fi
fi

# 4.3 取得課程列表
print_info "[4.3] 測試取得課程列表"
COURSES=$(curl -s -X GET "$API_URL/api/courses" \
  -H "Authorization: Bearer $TOKEN")

COURSE_API_COUNT=$(echo "$COURSES" | grep -o '"id"' | wc -l | tr -d ' ')
if [ "$COURSE_API_COUNT" -ge 1 ]; then
    print_success "課程列表取得成功 (共 $COURSE_API_COUNT 個課程)"
else
    print_error "課程列表取得失敗"
    exit 1
fi

# 4.4 取得課程單元
print_info "[4.4] 測試取得課程單元"
LESSONS=$(curl -s -X GET "$API_URL/api/courses/1/lessons" \
  -H "Authorization: Bearer $TOKEN")

LESSON_API_COUNT=$(echo "$LESSONS" | grep -o '"id"' | wc -l | tr -d ' ')
if [ "$LESSON_API_COUNT" -ge 1 ]; then
    print_success "單元列表取得成功 (共 $LESSON_API_COUNT 個單元)"
else
    print_error "單元列表取得失敗"
    exit 1
fi

# 4.5 更新學習進度
print_info "[4.5] 測試更新學習進度"
PROGRESS=$(curl -s -X POST "$API_URL/api/progress/update" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1,"position":600,"duration":600}')

if echo "$PROGRESS" | grep -q '"progressPercentage":100'; then
    print_success "進度更新成功 (100%)"
else
    print_error "進度更新失敗"
    exit 1
fi

# 4.6 交付單元
print_info "[4.6] 測試交付單元 (獲得經驗值)"
SUBMIT=$(curl -s -X POST "$API_URL/api/progress/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":1}')

if echo "$SUBMIT" | grep -q '"experienceGained":200'; then
    print_success "單元交付成功 (獲得 200 經驗值)"
else
    print_error "單元交付失敗"
    exit 1
fi

# 4.7 驗證用戶經驗值
print_info "[4.7] 驗證用戶經驗值更新"
USER=$(curl -s -X GET "$API_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$USER" | grep -q '"experience":200'; then
    print_success "用戶經驗值驗證成功"
else
    print_error "用戶經驗值驗證失敗"
    exit 1
fi

echo ""

# ===========================================
# 5. 資料庫狀態驗證
# ===========================================

print_header "步驟 5: 資料庫狀態驗證"

# 檢查 progress 表
PROGRESS_COUNT=$(docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -t -c "SELECT COUNT(*) FROM progress WHERE is_submitted = true;")

if [ "$PROGRESS_COUNT" -ge 1 ]; then
    print_success "進度記錄已正確寫入資料庫"
else
    print_error "進度記錄寫入失敗"
    exit 1
fi

# 檢查用戶經驗值
USER_EXP=$(docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -t -c "SELECT experience FROM users WHERE email = 'e2e-test@example.com';")

if [ "$USER_EXP" -ge 200 ]; then
    print_success "用戶經驗值已正確更新 ($USER_EXP EXP)"
else
    print_error "用戶經驗值更新失敗"
    exit 1
fi

echo ""

# ===========================================
# 6. 測試總結
# ===========================================

print_header "E2E 測試完成"
print_success "所有測試通過！"

echo ""
echo "測試統計:"
echo "  - Flyway Migrations: ✅"
echo "  - 資料表建立: ✅ (4 張表)"
echo "  - 測試資料: ✅ (2 課程 + 5 單元)"
echo "  - 用戶認證: ✅"
echo "  - 課程 API: ✅"
echo "  - 進度追蹤: ✅"
echo "  - 經驗系統: ✅"
echo ""

# ===========================================
# 7. 清理環境 (可選)
# ===========================================

if [ "$CLEANUP" = "true" ]; then
    print_header "清理環境"
    print_info "停止並清理所有容器..."
    docker-compose down -v
    print_success "環境清理完成"
else
    print_info "服務保持運行中，可繼續測試"
    print_info "查看日誌: docker-compose logs -f"
    print_info "停止服務: docker-compose down"
    print_info "完全清理: docker-compose down -v"
fi

echo ""
print_success "🎉 E2E 測試執行完畢！"
