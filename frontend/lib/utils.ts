/**
 * 通用工具函式
 */

import { ClassNameProp } from '@/types/ui'

/**
 * 合併 className
 * 支援字串、陣列、物件格式
 */
export function cn(...classes: (ClassNameProp | undefined | null | false)[]): string {
  const result: string[] = []

  for (const cls of classes) {
    if (!cls) continue

    if (typeof cls === 'string') {
      result.push(cls)
    } else if (Array.isArray(cls)) {
      result.push(cn(...cls))
    } else if (typeof cls === 'object') {
      for (const [key, value] of Object.entries(cls)) {
        if (value) result.push(key)
      }
    }
  }

  return result.join(' ')
}

/**
 * 格式化數字 (加上千分位)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-TW')
}

/**
 * 格式化時長 (秒數轉為 mm:ss 或 hh:mm:ss)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: number, format: 'short' | 'long' = 'short'): string {
  const date = new Date(timestamp)

  if (format === 'short') {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化相對時間 (例如: 2 天前)
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} 天前`
  if (hours > 0) return `${hours} 小時前`
  if (minutes > 0) return `${minutes} 分鐘前`
  return '剛剛'
}

/**
 * 截斷文字
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * 延遲函式 (用於模擬 API 請求)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 產生隨機 ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * 深度複製物件
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 檢查是否為瀏覽器環境
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * 獲取環境變數
 */
export function getEnv(key: string, defaultValue = ''): string {
  if (!isBrowser) {
    return process.env[key] || defaultValue
  }
  return defaultValue
}
