/**
 * NotificationList 通知列表
 *
 * 顯示通知項目列表
 */

'use client'

import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  type?: 'info' | 'success' | 'warning'
}

interface NotificationListProps {
  notifications?: Notification[]
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

export default function NotificationList({
  notifications = [],
  onMarkAsRead,
  onDelete,
  className,
}: NotificationListProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-text-disabled mx-auto mb-3" />
          <p className="text-text-muted">目前沒有通知</p>
        </div>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className={cn(
              'p-4 rounded-lg border transition-colors',
              notif.isRead
                ? 'bg-background-tertiary border-border'
                : 'bg-primary/5 border-primary/30'
            )}
          >
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <h4 className={cn(
                  'text-sm font-semibold',
                  notif.isRead ? 'text-text-secondary' : 'text-text-primary'
                )}>
                  {notif.title}
                </h4>
                <p className="text-xs text-text-muted">{notif.message}</p>
                <p className="text-xs text-text-disabled">
                  {new Date(notif.timestamp).toLocaleString('zh-TW')}
                </p>
              </div>
              <div className="flex gap-1">
                {!notif.isRead && (
                  <button
                    onClick={() => onMarkAsRead?.(notif.id)}
                    className="p-1 hover:bg-background-hover rounded"
                  >
                    <CheckCheck className="w-4 h-4 text-status-success" />
                  </button>
                )}
                <button
                  onClick={() => onDelete?.(notif.id)}
                  className="p-1 hover:bg-background-hover rounded"
                >
                  <Trash2 className="w-4 h-4 text-status-error" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
