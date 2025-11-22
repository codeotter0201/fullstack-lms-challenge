/**
 * useClickOutside Hook
 *
 * 用於偵測元素外部的點擊事件
 */

'use client'

import { useEffect, RefObject } from 'react'

/**
 * useClickOutside Hook
 *
 * @param ref - 要監聽的元素 ref
 * @param handler - 點擊外部時的回調函數
 * @param enabled - 是否啟用（默認為 true）
 *
 * @example
 * const dropdownRef = useRef<HTMLDivElement>(null)
 * const [isOpen, setIsOpen] = useState(false)
 *
 * useClickOutside(dropdownRef, () => {
 *   setIsOpen(false)
 * })
 *
 * <div ref={dropdownRef}>
 *   Dropdown content
 * </div>
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref?.current

      // 如果點擊在元素內部或元素不存在，則不執行
      if (!element || element.contains(event.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler, enabled])
}
