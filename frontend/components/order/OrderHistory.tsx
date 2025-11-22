/**
 * OrderHistory 訂單記錄列表
 *
 * 顯示用戶的所有訂單記錄
 */

'use client'

import { useState } from 'react'
import { Receipt, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import OrderCard from './OrderCard'

type OrderStatus = 'completed' | 'pending' | 'cancelled'

interface Order {
  id: string
  orderNumber: string
  courseName: string
  courseImage?: string
  amount: number
  discount?: number
  finalAmount: number
  status: OrderStatus
  createdAt: Date
}

interface OrderHistoryProps {
  orders?: Order[]
  className?: string
}

export default function OrderHistory({
  orders = [],
  className,
}: OrderHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((order) => order.status === filterStatus)

  const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'completed', label: '已完成' },
    { value: 'pending', label: '處理中' },
    { value: 'cancelled', label: '已取消' },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* 標題 - 符合目標網站設計 */}
      <div className="flex items-center gap-3 px-6 py-4 bg-background-secondary border border-border rounded-lg">
        <Receipt className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-primary">
          訂單紀錄
        </h2>
      </div>

      {/* 訂單列表 */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-background-tertiary border border-border rounded-lg">
          <p className="text-base text-text-secondary">
            目前沒有訂單記錄
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              orderNumber={order.orderNumber}
              courseName={order.courseName}
              courseImage={order.courseImage}
              amount={order.amount}
              discount={order.discount}
              finalAmount={order.finalAmount}
              status={order.status}
              createdAt={order.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
