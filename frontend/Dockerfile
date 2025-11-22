# =============================================================================
# Waterball LMS Frontend - Multi-stage Dockerfile
# =============================================================================
#
# 此 Dockerfile 使用多階段建置來優化映像檔大小和建置效能
#
# 階段:
#   1. deps      - 安裝 dependencies (production + development)
#   2. builder   - 建置 Next.js 應用程式
#   3. runner    - 執行階段（最小化映像檔）
#
# 建置指令:
#   docker build -t waterball-lms-frontend .
#
# 執行指令:
#   docker run -p 3000:3000 --env-file .env.development waterball-lms-frontend
#
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# 安裝所有 dependencies（包含 devDependencies，用於建置）
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps

# 安裝 libc6-compat 以提升 Alpine Linux 相容性
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 複製 package 檔案
COPY package.json package-lock.json* ./

# 安裝 dependencies
# 使用 npm ci 而非 npm install 以確保一致性
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 2: Builder
# 建置 Next.js 應用程式
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# 從 deps 階段複製 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 複製應用程式原始碼
COPY . .

# 設定環境變數（建置時需要）
# 注意：這些變數會在建置時被嵌入，不應包含敏感資訊
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 建置 Next.js 應用程式
# Next.js 會自動產生 standalone 輸出（如果 next.config.js 有設定）
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Runner (Production)
# 最小化的執行階段映像檔
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# 設定環境變數
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 建立非 root 使用者以提升安全性
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 複製 public 資料夾（靜態資源）
COPY --from=builder /app/public ./public

# 複製 Next.js 建置輸出
# 如果使用 standalone 模式，只需複製 .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切換到非 root 使用者
USER nextjs

# 暴露 3000 port
EXPOSE 3000

# 設定 hostname 為 0.0.0.0 以允許外部連接
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

# 啟動應用程式
CMD ["node", "server.js"]

# =============================================================================
# 備註
# =============================================================================
#
# 1. 映像檔大小優化：
#    - 使用 Alpine Linux (node:20-alpine)
#    - 多階段建置移除建置工具和 devDependencies
#    - Standalone 模式減少不必要的檔案
#
# 2. 安全性：
#    - 使用非 root 使用者 (nextjs:1001)
#    - 最小化映像檔攻擊面
#    - 禁用 Next.js 遙測
#
# 3. Next.js Standalone 模式：
#    - 需要在 next.config.js 中啟用: output: 'standalone'
#    - 大幅減少 node_modules 大小
#    - 僅包含執行時需要的檔案
#
# 4. 環境變數：
#    - 建置時變數: 在建置階段設定（如 NEXT_PUBLIC_*）
#    - 執行時變數: 透過 docker run --env-file 或 docker-compose 傳入
#
# 5. 效能優化：
#    - 使用 npm ci 而非 npm install
#    - 分層快取策略（dependencies 獨立層）
#    - 多階段建置避免重複安裝
#
# =============================================================================
