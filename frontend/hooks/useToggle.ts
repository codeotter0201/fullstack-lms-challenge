/**
 * useToggle Hook
 *
 * 用於管理布林值的切換狀態
 */

'use client'

import { useState, useCallback } from 'react'

/**
 * useToggle Hook
 *
 * @param initialValue - 初始值（默認為 false）
 * @returns [value, toggle, setTrue, setFalse, setValue]
 *
 * @example
 * const [isOpen, toggle, open, close] = useToggle(false)
 *
 * <Button onClick={toggle}>Toggle</Button>
 * <Button onClick={open}>Open</Button>
 * <Button onClick={close}>Close</Button>
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, () => void, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, setTrue, setFalse, setValue]
}
