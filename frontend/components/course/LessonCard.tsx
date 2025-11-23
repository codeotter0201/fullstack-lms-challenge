/**
 * LessonCard 單元卡片元件
 *
 * 用於顯示單元資訊，支援完成狀態、鎖定狀態、進度顯示
 */

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card, Badge, ProgressBar } from '@/components/ui'
import { Lesson, LessonType } from '@/types/journey'
import { LessonProgress } from '@/types/lesson'
import { Video, FileText, CheckCircle, Lock, Award } from 'lucide-react'

interface LessonCardProps {
  lesson: Lesson
  progress?: LessonProgress
  locked?: boolean
  className?: string
}

const lessonTypeIcons = {
  [LessonType.VIDEO]: Video,
  [LessonType.SCROLL]: FileText,
  [LessonType.GOOGLE_FORM]: FileText,
}

const lessonTypeNames = {
  [LessonType.VIDEO]: '影片',
  [LessonType.SCROLL]: '閱讀',
  [LessonType.GOOGLE_FORM]: '表單',
}

export default function LessonCard({
  lesson,
  progress,
  locked = false,
  className,
}: LessonCardProps) {
  const {
    id,
    journeyId,
    name,
    description,
    premiumOnly,
    type,
    videoLength,
    reward,
  } = lesson

  const isCompleted = progress?.completed || false
  const isDelivered = progress?.delivered || false
  const progressPercentage = progress?.percentage || 0

  const Icon = lessonTypeIcons[type as LessonType] || Video

  // 鎖定狀態不可點擊
  const content = (
    <Card
      hoverable={!locked}
      clickable={!locked}
      padding="md"
      className={cn(
        'transition-all duration-200',
        locked && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* 圖示 */}
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-lg',
            'flex items-center justify-center',
            isCompleted
              ? 'bg-green-100 text-green-600'
              : locked
              ? 'bg-gray-100 text-gray-400'
              : 'bg-primary-100 text-primary-600'
          )}
        >
          {locked ? (
            <Lock className="w-6 h-6" />
          ) : isCompleted ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>

        {/* 內容 */}
        <div className="flex-1 min-w-0">
          {/* 標題列 */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4
              className={cn(
                'font-medium text-gray-900',
                locked && 'text-gray-500'
              )}
            >
              {name}
            </h4>

            <div className="flex-shrink-0 flex items-center gap-2">
              {/* 付費標記 */}
              {premiumOnly && (
                <Badge variant="warning" size="sm">
                  付費
                </Badge>
              )}

              {/* 完成標記 */}
              {isCompleted && (
                <Badge variant="success" size="sm">
                  已完成
                </Badge>
              )}

              {/* 已交付標記 */}
              {isDelivered && reward && (
                <div className="flex items-center gap-1 text-green-600">
                  <Award className="w-4 h-4" />
                  <span className="text-xs">+{reward.exp} EXP</span>
                </div>
              )}
            </div>
          </div>

          {/* 描述 */}
          {description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {description}
            </p>
          )}

          {/* 元資料 */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <span>{lessonTypeNames[type as LessonType] || '影片'}</span>
            {videoLength && (
              <>
                <span>•</span>
                <span>{videoLength}</span>
              </>
            )}
            {!locked && reward && (
              <>
                <span>•</span>
                <span className="text-primary-600">
                  +{reward.exp} EXP
                </span>
              </>
            )}
          </div>

          {/* 進度條 */}
          {!locked && progressPercentage > 0 && !isCompleted && (
            <ProgressBar
              percentage={progressPercentage}
              height={4}
              color="bg-primary-500"
            />
          )}
        </div>
      </div>
    </Card>
  )

  // 如果鎖定，不包裝 Link
  if (locked) {
    return content
  }

  return (
    <Link href={`/journeys/${journeyId}/lessons/${id}`}>
      {content}
    </Link>
  )
}
