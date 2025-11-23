/**
 * usePurchaseHistory Hook
 *
 * 獲取使用者的購買記錄（訂單歷史）
 * 自動在使用者登入時載入，未登入時返回空陣列
 */

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getMyPurchases } from '@/lib/api/purchases'
import { transformPurchasesToOrders, type Order } from '@/lib/utils/orderTransformer'

/**
 * 購買記錄 Hook 返回值
 */
export interface UsePurchaseHistoryReturn {
  orders: Order[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * 使用者購買記錄 Hook
 *
 * @returns {UsePurchaseHistoryReturn} 訂單列表、載入狀態、錯誤訊息、重新獲取函數
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { orders, isLoading, error, refetch } = usePurchaseHistory()
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <div>Error: {error}</div>
 *   if (orders.length === 0) return <div>No orders</div>
 *
 *   return <OrderHistory orders={orders} />
 * }
 * ```
 */
export function usePurchaseHistory(): UsePurchaseHistoryReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, isAuthenticated } = useAuth()

  /**
   * 載入購買記錄
   */
  const loadPurchases = async () => {
    // 未登入時清空訂單
    if (!isAuthenticated || !user) {
      setOrders([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await getMyPurchases()

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || '無法獲取購買記錄')
      }

      // 轉換後端資料為前端格式
      const transformedOrders = transformPurchasesToOrders(response.data)

      setOrders(transformedOrders)
    } catch (err) {
      console.error('Failed to load purchase history:', err)
      setError(err instanceof Error ? err.message : '載入購買記錄失敗')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  // 當使用者登入狀態改變時，自動重新載入
  useEffect(() => {
    loadPurchases()
  }, [user, isAuthenticated])

  return {
    orders,
    isLoading,
    error,
    refetch: loadPurchases,
  }
}
