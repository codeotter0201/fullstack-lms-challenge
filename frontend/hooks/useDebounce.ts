/**
 * useDebounce Hook
 *
 * 用於延遲執行，常用於搜尋輸入等場景
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * useDebounce Hook
 *
 * @param value - 要延遲的值
 * @param delay - 延遲時間（毫秒）
 * @returns 延遲後的值
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   // 只有在用戶停止輸入 500ms 後才執行搜尋
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm)
 *   }
 * }, [debouncedSearchTerm])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // 設定定時器
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 清除定時器（當 value 或 delay 改變時）
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
