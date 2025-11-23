/**
 * Order Transformer
 *
 * 將後端 PurchaseDTO 轉換為前端 Order 類型
 */

import type { PurchaseDTO } from '@/types/backend'

/**
 * 訂單資料結構（OrderHistory 組件需要的格式）
 */
export interface Order {
  id: string
  orderNumber: string
  courseName: string
  courseImage?: string
  amount: number
  discount?: number
  finalAmount: number
  status: 'completed' | 'pending' | 'cancelled'
  createdAt: Date
}

/**
 * 支付狀態映射
 * 將後端的支付狀態轉換為前端的訂單狀態
 */
const STATUS_MAP: Record<string, Order['status']> = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'cancelled',
  REFUNDED: 'cancelled',
}

/**
 * 將 PurchaseDTO 轉換為 Order
 *
 * @param purchase - 後端返回的購買記錄
 * @returns Order - 前端 OrderHistory 組件需要的格式
 */
export function transformPurchaseToOrder(purchase: PurchaseDTO): Order {
  // 映射支付狀態，未知狀態預設為 pending
  const status = STATUS_MAP[purchase.paymentStatus] || 'pending'

  return {
    id: purchase.id.toString(),
    orderNumber: purchase.transactionId || `ORD-${purchase.id}`,
    courseName: purchase.courseTitle,
    courseImage: undefined, // 後端目前不提供課程圖片
    amount: purchase.purchasePrice,
    discount: 0, // 後端目前沒有記錄折扣金額
    finalAmount: purchase.purchasePrice,
    status,
    createdAt: new Date(purchase.purchaseDate),
  }
}

/**
 * 批量轉換 PurchaseDTO 陣列為 Order 陣列
 *
 * @param purchases - 後端返回的購買記錄陣列
 * @returns Order[] - 轉換後的訂單陣列
 */
export function transformPurchasesToOrders(purchases: PurchaseDTO[]): Order[] {
  return purchases.map(transformPurchaseToOrder)
}
