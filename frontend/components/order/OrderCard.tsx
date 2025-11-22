/**
 * OrderCard 訂單卡片
 *
 * 顯示單筆訂單的摘要資訊
 */

'use client'

import { Calendar, CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type OrderStatus = 'completed' | 'pending' | 'cancelled'

interface OrderCardProps {
  orderNumber: string
  courseName: string
  courseImage?: string
  amount: number
  discount?: number
  finalAmount: number
  status: OrderStatus
  createdAt: Date
  className?: string
}

const statusConfig = {
  completed: {
    label: '已完成',
    icon: CheckCircle2,
    color: 'text-status-success',
    bgColor: 'bg-status-success/10',
  },
  pending: {
    label: '處理中',
    icon: Clock,
    color: 'text-status-warning',
    bgColor: 'bg-status-warning/10',
  },
  cancelled: {
    label: '已取消',
    icon: XCircle,
    color: 'text-text-disabled',
    bgColor: 'bg-text-disabled/10',
  },
}

export default function OrderCard({
  orderNumber,
  courseName,
  courseImage,
  amount,
  discount = 0,
  finalAmount,
  status,
  createdAt,
  className,
}: OrderCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  const formattedDate = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(createdAt)

  return (
    <div
      className={cn(
        'bg-background-tertiary border border-border rounded-lg overflow-hidden',
        'hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      <div className="p-4 space-y-4">
        {/* 頂部：訂單編號與狀態 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-mono text-text-secondary">
              {orderNumber}
            </span>
          </div>
          <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full', config.bgColor)}>
            <StatusIcon className={cn('w-4 h-4', config.color)} />
            <span className={cn('text-xs font-medium', config.color)}>
              {config.label}
            </span>
          </div>
        </div>

        {/* 課程資訊 */}
        <div className="flex gap-3">
          {/* 課程縮圖 */}
          {courseImage ? (
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-background-secondary">
              <img
                src={courseImage}
                alt={courseName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg flex-shrink-0 bg-background-secondary flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-text-disabled" />
            </div>
          )}

          {/* 課程名稱與時間 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-text-primary mb-1 line-clamp-2">
              {courseName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* 價格資訊 */}
        <div className="space-y-2 pt-3 border-t border-border">
          {/* 原價 */}
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">原價</span>
              <span className="text-text-muted line-through">
                NT$ {amount.toLocaleString()}
              </span>
            </div>
          )}

          {/* 折扣 */}
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-status-success">折扣</span>
              <span className="text-status-success font-medium">
                - NT$ {discount.toLocaleString()}
              </span>
            </div>
          )}

          {/* 實付金額 */}
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-text-primary">實付金額</span>
            <span className="text-lg font-bold text-primary">
              NT$ {finalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
