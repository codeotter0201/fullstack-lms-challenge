/**
 * useMediaQuery Hook
 *
 * 用於偵測媒體查詢條件，實現響應式邏輯
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * useMediaQuery Hook
 *
 * @param query - 媒體查詢字串，例如 '(min-width: 768px)'
 * @returns 是否符合媒體查詢條件
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)')
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1919px)')
 * const isDesktop = useMediaQuery('(min-width: 1920px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // SSR 環境檢查
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(query)

    // 設定初始值
    setMatches(mediaQuery.matches)

    // 監聽變化
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // 使用 addEventListener（現代瀏覽器）
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // 向下兼容舊版瀏覽器
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [query])

  return matches
}

/**
 * 預定義的斷點 Hooks
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1919px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1920px)')
}

export function useIsTabletOrDesktop() {
  return useMediaQuery('(min-width: 768px)')
}

/**
 * 獲取當前裝置類型
 */
export function useDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()

  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  if (isDesktop) return 'desktop'

  // 默認為 desktop
  return 'desktop'
}
