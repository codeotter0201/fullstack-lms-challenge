/**
 * CertificateCard 證書卡片
 *
 * 顯示課程完成證書，支援下載與分享
 */

'use client'

import { Download, Share2, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface CertificateCardProps {
  journeyName: string
  userName: string
  completedAt?: Date
  certificateUrl?: string
  onDownload?: () => void
  onShare?: () => void
  className?: string
}

export default function CertificateCard({
  journeyName,
  userName,
  completedAt,
  certificateUrl,
  onDownload,
  onShare,
  className,
}: CertificateCardProps) {
  const formattedDate = completedAt
    ? new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(completedAt)
    : '尚未完成'

  const isCompleted = !!completedAt

  return (
    <div
      className={cn(
        'bg-background-tertiary border border-border rounded-lg overflow-hidden',
        'transition-shadow duration-300',
        isCompleted && 'hover:shadow-lg',
        className
      )}
    >
      {/* 證書預覽區 */}
      <div
        className={cn(
          'relative aspect-[4/3] flex items-center justify-center',
          'bg-gradient-to-br from-background-secondary to-background-hover',
          !isCompleted && 'opacity-50'
        )}
      >
        {certificateUrl ? (
          <img
            src={certificateUrl}
            alt={`${journeyName} 證書`}
            className="w-full h-full object-cover"
          />
        ) : (
          // 證書佔位符
          <div className="text-center">
            <Award className="w-16 h-16 text-primary mx-auto mb-3" />
            <p className="text-sm font-medium text-text-primary">
              {isCompleted ? '證書已獲得' : '尚未獲得證書'}
            </p>
          </div>
        )}

        {/* 完成標記 */}
        {isCompleted && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-status-success/90 backdrop-blur-sm">
            <span className="text-xs font-semibold text-white">已完成</span>
          </div>
        )}
      </div>

      {/* 證書資訊 */}
      <div className="p-4 space-y-3">
        {/* 課程名稱 */}
        <div>
          <h3 className="text-base font-semibold text-text-primary mb-1">
            {journeyName}
          </h3>
          <p className="text-sm text-text-secondary">
            授予：{userName}
          </p>
        </div>

        {/* 完成日期 */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Award className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>

        {/* 操作按鈕 */}
        {isCompleted && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              下載證書
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-1" />
              分享
            </Button>
          </div>
        )}

        {/* 未完成提示 */}
        {!isCompleted && (
          <div className="text-center py-2">
            <p className="text-sm text-text-muted">
              完成所有課程單元即可獲得證書
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
