/**
 * usePagination Hook
 *
 * 用於管理分頁邏輯
 */

'use client'

import { useState, useMemo, useCallback } from 'react'

interface UsePaginationProps {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

interface UsePaginationReturn<T> {
  currentPage: number
  totalPages: number
  pageSize: number
  startIndex: number
  endIndex: number
  canGoNext: boolean
  canGoPrevious: boolean
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setPageSize: (size: number) => void
  getPaginatedItems: (items: T[]) => T[]
}

/**
 * usePagination Hook
 *
 * @param totalItems - 總項目數
 * @param itemsPerPage - 每頁項目數（默認 10）
 * @param initialPage - 初始頁碼（默認 1）
 *
 * @example
 * const pagination = usePagination({
 *   totalItems: users.length,
 *   itemsPerPage: 20,
 * })
 *
 * const displayedUsers = pagination.getPaginatedItems(users)
 *
 * <Button onClick={pagination.previousPage} disabled={!pagination.canGoPrevious}>
 *   Previous
 * </Button>
 * <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
 * <Button onClick={pagination.nextPage} disabled={!pagination.canGoNext}>
 *   Next
 * </Button>
 */
export function usePagination<T = any>({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(itemsPerPage)

  // 計算總頁數
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize)
  }, [totalItems, pageSize])

  // 計算起始和結束索引
  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize
  }, [currentPage, pageSize])

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems)
  }, [startIndex, pageSize, totalItems])

  // 是否可以前進/後退
  const canGoNext = currentPage < totalPages
  const canGoPrevious = currentPage > 1

  // 跳轉到指定頁面
  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
    },
    [totalPages]
  )

  // 下一頁
  const nextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1)
    }
  }, [canGoNext])

  // 上一頁
  const previousPage = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage(prev => prev - 1)
    }
  }, [canGoPrevious])

  // 更新每頁項目數
  const handleSetPageSize = useCallback(
    (size: number) => {
      setPageSize(size)
      // 重置到第一頁
      setCurrentPage(1)
    },
    []
  )

  // 獲取當前頁的項目
  const getPaginatedItems = useCallback(
    (items: T[]): T[] => {
      return items.slice(startIndex, endIndex)
    },
    [startIndex, endIndex]
  )

  return {
    currentPage,
    totalPages,
    pageSize,
    startIndex,
    endIndex,
    canGoNext,
    canGoPrevious,
    goToPage,
    nextPage,
    previousPage,
    setPageSize: handleSetPageSize,
    getPaginatedItems,
  }
}
