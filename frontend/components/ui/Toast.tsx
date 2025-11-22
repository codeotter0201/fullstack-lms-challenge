/**
 * Toast 通知元件
 *
 * 用於顯示臨時通知訊息
 */

'use client'

import { useEffect } from 'react'
import { ToastMessage } from '@/types/ui'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

interface ToastProps extends ToastMessage {
  onClose: () => void
}

export default function Toast({
  type,
  title,
  message,
  duration = 3000,
  closable = true,
  onClose,
}: ToastProps) {
  const Icon = iconMap[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        'px-4 py-3 rounded-lg',
        'border shadow-lg',
        'animate-in slide-in-from-top-full duration-300',
        colorMap[type]
      )}
    >
      {/* 圖示 */}
      <Icon className={cn('w-5 h-5 flex-shrink-0', iconColorMap[type])} />

      {/* 內容 */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-medium mb-1">{title}</p>
        )}
        <p className="text-sm">{message}</p>
      </div>

      {/* 關閉按鈕 */}
      {closable && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

/**
 * Toast 容器元件
 */
interface ToastContainerProps {
  toasts: ToastMessage[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 min-w-[320px] max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}
