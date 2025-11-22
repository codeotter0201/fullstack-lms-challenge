/**
 * AccountBinding 帳號綁定
 *
 * 顯示與管理第三方帳號綁定狀態
 */

'use client'

import { useState } from 'react'
import { Link2, Unlink, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface SocialAccount {
  platform: 'discord' | 'github' | 'line' | 'google' | 'facebook'
  label: string
  icon: string
  color: string
  isConnected: boolean
  connectedEmail?: string
}

interface AccountBindingProps {
  accounts?: SocialAccount[]
  onConnect?: (platform: string) => void
  onDisconnect?: (platform: string) => void
  className?: string
}

const defaultAccounts: SocialAccount[] = [
  {
    platform: 'discord',
    label: 'Discord',
    icon: '🎮',
    color: 'bg-[#5865F2]/10 border-[#5865F2]/30',
    isConnected: false,
  },
  {
    platform: 'github',
    label: 'GitHub',
    icon: '🐙',
    color: 'bg-gray-100/10 border-gray-500/30',
    isConnected: false,
  },
  {
    platform: 'line',
    label: 'LINE',
    icon: '💬',
    color: 'bg-[#00B900]/10 border-[#00B900]/30',
    isConnected: false,
  },
  {
    platform: 'google',
    label: 'Google',
    icon: '🔍',
    color: 'bg-[#4285F4]/10 border-[#4285F4]/30',
    isConnected: false,
  },
  {
    platform: 'facebook',
    label: 'Facebook',
    icon: '📘',
    color: 'bg-[#1877F2]/10 border-[#1877F2]/30',
    isConnected: false,
  },
]

export default function AccountBinding({
  accounts = defaultAccounts,
  onConnect,
  onDisconnect,
  className,
}: AccountBindingProps) {
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null)

  const handleConnect = async (platform: string) => {
    setLoadingPlatform(platform)
    try {
      await onConnect?.(platform)
    } finally {
      setLoadingPlatform(null)
    }
  }

  const handleDisconnect = async (platform: string) => {
    setLoadingPlatform(platform)
    try {
      await onDisconnect?.(platform)
    } finally {
      setLoadingPlatform(null)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 標題 */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text-primary">帳號綁定</h3>
        <p className="text-sm text-text-secondary">
          綁定第三方帳號可快速登入，並同步學習進度
        </p>
      </div>

      {/* 帳號列表 */}
      <div className="space-y-3">
        {accounts.map((account) => {
          const isLoading = loadingPlatform === account.platform

          return (
            <div
              key={account.platform}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border',
                'transition-colors duration-200',
                account.color,
                account.isConnected
                  ? 'bg-status-success/5 border-status-success/30'
                  : 'bg-background-tertiary'
              )}
            >
              {/* 左側：平台資訊 */}
              <div className="flex items-center gap-3">
                {/* 平台圖示 */}
                <div className="w-10 h-10 rounded-lg bg-background-secondary flex items-center justify-center text-2xl">
                  {account.icon}
                </div>

                {/* 平台名稱與狀態 */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {account.label}
                    </span>
                    {account.isConnected && (
                      <CheckCircle2 className="w-4 h-4 text-status-success" />
                    )}
                  </div>
                  {account.connectedEmail ? (
                    <p className="text-xs text-text-muted mt-0.5">
                      {account.connectedEmail}
                    </p>
                  ) : (
                    <p className="text-xs text-text-muted mt-0.5">
                      {account.isConnected ? '已綁定' : '尚未綁定'}
                    </p>
                  )}
                </div>
              </div>

              {/* 右側：操作按鈕 */}
              {account.isConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(account.platform)}
                  disabled={isLoading}
                  className="text-status-error hover:bg-status-error/10 hover:border-status-error"
                >
                  {isLoading ? (
                    '處理中...'
                  ) : (
                    <>
                      <Unlink className="w-4 h-4 mr-1" />
                      解除綁定
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnect(account.platform)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    '連接中...'
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 mr-1" />
                      綁定帳號
                    </>
                  )}
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* 提示訊息 */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-text-secondary">
          💡 <strong>提示：</strong>綁定多個帳號可增加帳號安全性，並享有更便利的登入體驗
        </p>
      </div>
    </div>
  )
}
