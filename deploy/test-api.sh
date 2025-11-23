#!/bin/bash

# 水球軟體學院 LMS - API 測試腳本

API_URL="${API_URL:-http://localhost:8080}"

echo "========================================="
echo "  水球軟體學院 LMS - API 測試"
echo "========================================="
echo ""

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 測試健康檢查
echo -e "${YELLOW}[1] 測試健康檢查端點${NC}"
echo "GET $API_URL/api/health"
curl -s "$API_URL/api/health" | json_pp || echo "請確認服務已啟動"
echo ""
echo ""

# 註冊測試用戶
echo -e "${YELLOW}[2] 註冊測試用戶${NC}"
echo "POST $API_URL/api/auth/register"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-student@example.com",
    "password": "password123",
    "displayName": "測試學生"
  }')

echo "$REGISTER_RESPONSE" | json_pp
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}註冊失敗或用戶已存在,嘗試登入...${NC}"

  # 登入測試用戶
  echo ""
  echo -e "${YELLOW}[3] 登入測試用戶${NC}"
  echo "POST $API_URL/api/auth/login"
  LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test-student@example.com",
      "password": "password123"
    }')

  echo "$LOGIN_RESPONSE" | json_pp
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
else
  echo -e "${GREEN}註冊成功!${NC}"
fi
echo ""

# 取得當前用戶資訊
if [ -n "$TOKEN" ]; then
  echo -e "${YELLOW}[4] 取得當前用戶資訊 (需要 JWT Token)${NC}"
  echo "GET $API_URL/api/auth/me"
  echo "Authorization: Bearer $TOKEN"
  curl -s -X GET "$API_URL/api/auth/me" \
    -H "Authorization: Bearer $TOKEN" | json_pp
  echo ""

  echo -e "${GREEN}✅ 所有測試完成!${NC}"
  echo ""
  echo "JWT Token (可用於後續 API 測試):"
  echo "$TOKEN"
else
  echo -e "${RED}❌ 無法取得 Token,請檢查服務狀態${NC}"
fi

echo ""
echo "========================================="
echo "  更多 API 測試請參考 API-EXAMPLES.md"
echo "========================================="
