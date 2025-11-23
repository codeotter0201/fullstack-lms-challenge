/**
 * ToastContext 通知上下文
 *
 * 管理全域 Toast 通知系統
 */

'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast } from '@/components/ui'
import { ToastType } from '@/types/ui'

interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void
  hideToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  /**
   * 顯示 Toast 通知
   */
  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()}`

      const newToast: ToastMessage = {
        id,
        type,
        message,
        duration,
      }

      setToasts(prev => [...prev, newToast])

      // 自動移除
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id)
        }, duration)
      }
    },
    []
  )

  /**
   * 隱藏 Toast 通知
   */
  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  /**
   * 快捷方法
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      showToast('success', message, duration)
    },
    [showToast]
  )

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast('error', message, duration)
    },
    [showToast]
  )

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast('warning', message, duration)
    },
    [showToast]
  )

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast('info', message, duration)
    },
    [showToast]
  )

  const value: ToastContextType = {
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast 容器 */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => hideToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/**
 * useToast Hook
 * 用於在元件中顯示通知
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
