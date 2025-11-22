/**
 * AppProviders 全域 Provider 包裝器
 *
 * 統一管理所有 Context Providers 的層級結構
 */

'use client'

import { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { ToastProvider } from './ToastContext'
import { JourneyProvider } from './JourneyContext'
import { LeaderboardProvider } from './LeaderboardContext'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * 全域 Providers 包裝器
 *
 * 層級結構（由外到內）：
 * 1. ToastProvider - 最外層，確保 Toast 可在任何地方使用
 * 2. AuthProvider - 認證層，提供用戶狀態
 * 3. JourneyProvider - 課程資料層，依賴認證狀態
 * 4. LeaderboardProvider - 排行榜資料層，依賴認證狀態
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <JourneyProvider>
          <LeaderboardProvider>
            {children}
          </LeaderboardProvider>
        </JourneyProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
