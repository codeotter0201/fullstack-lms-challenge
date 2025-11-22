/**
 * useLocalStorage Hook
 *
 * 用於管理 localStorage 的資料，並與 React state 同步
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((val: T) => T)

/**
 * useLocalStorage Hook
 *
 * @param key - localStorage 的 key
 * @param initialValue - 初始值
 * @returns [value, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // 從 localStorage 讀取初始值
  const readValue = useCallback((): T => {
    // 在 SSR 環境中返回初始值
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  // 設定值到 state 和 localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      // 在 SSR 環境中不執行
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        )
        return
      }

      try {
        // 支援函數式更新
        const newValue = value instanceof Function ? value(storedValue) : value

        // 保存到 localStorage
        window.localStorage.setItem(key, JSON.stringify(newValue))

        // 更新 state
        setStoredValue(newValue)

        // 發送自定義事件，讓其他實例可以監聽
        window.dispatchEvent(new Event('local-storage'))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // 移除值
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
      window.dispatchEvent(new Event('local-storage'))
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // 監聽 storage 事件（跨 tab 同步）
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue())
    }

    // 監聽 storage 事件（跨 tab）
    window.addEventListener('storage', handleStorageChange)

    // 監聽自定義事件（同 tab）
    window.addEventListener('local-storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange)
    }
  }, [readValue])

  return [storedValue, setValue, removeValue]
}
