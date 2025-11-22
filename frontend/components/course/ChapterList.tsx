/**
 * ChapterList 章節列表元件
 *
 * 用於顯示課程章節，支援展開/收合、密碼解鎖
 */

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, Badge, Button } from '@/components/ui'
import { Chapter } from '@/types/journey'
import { LessonProgress } from '@/types/lesson'
import { ChevronDown, ChevronRight, Lock, Award, CheckCircle } from 'lucide-react'
import LessonCard from './LessonCard'

interface ChapterListProps {
  chapters: Chapter[]
  progressMap?: Record<number, LessonProgress>
  className?: string
}

interface ChapterItemProps {
  chapter: Chapter
  progressMap?: Record<number, LessonProgress>
}

function ChapterItem({ chapter, progressMap }: ChapterItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(!chapter.passwordRequired)

  const { name, lessons, gyms, reward, passwordRequired } = chapter

  // 計算章節完成度
  const completedLessons = lessons.filter((lesson) => {
    const progress = progressMap?.[lesson.id]
    return progress?.completed
  }).length

  const totalLessons = lessons.length
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const isChapterCompleted = completedLessons === totalLessons && totalLessons > 0

  const handleUnlock = () => {
    // TODO: 實作密碼驗證邏輯（R2）
    if (password === 'demo') {
      setIsUnlocked(true)
      setIsUnlocking(false)
    } else {
      alert('密碼錯誤')
    }
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {/* 章節標題列 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full px-6 py-4',
          'flex items-center justify-between gap-4',
          'text-left',
          'hover:bg-gray-50 transition-colors',
          'border-b border-gray-200'
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* 展開/收合圖示 */}
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </span>

          {/* 章節名稱 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>
                {completedLessons} / {totalLessons} 已完成
              </span>
              {gyms.length > 0 && (
                <>
                  <span>•</span>
                  <span>{gyms.length} 個道館</span>
                </>
              )}
            </div>
          </div>

          {/* 狀態標記 */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {passwordRequired && !isUnlocked && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                需要密碼
              </Badge>
            )}

            {isChapterCompleted && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                已完成
              </Badge>
            )}

            {/* 章節獎勵 */}
            <div className="flex items-center gap-1 text-primary-600">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">+{reward.exp} EXP</span>
            </div>
          </div>
        </div>

        {/* 完成度百分比 */}
        <div className="flex-shrink-0 text-right">
          <div
            className={cn(
              'text-2xl font-bold',
              isChapterCompleted ? 'text-green-600' : 'text-gray-900'
            )}
          >
            {completionPercentage}%
          </div>
        </div>
      </button>

      {/* 章節內容 */}
      {isExpanded && (
        <div className="p-6">
          {/* 密碼解鎖 */}
          {passwordRequired && !isUnlocked && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    此章節需要密碼解鎖
                  </h4>
                  {isUnlocking ? (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="請輸入密碼"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <Button onClick={handleUnlock} size="sm">
                        解鎖
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsUnlocking(false)}
                      >
                        取消
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsUnlocking(true)}
                    >
                      輸入密碼
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 單元列表 */}
          {isUnlocked ? (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={progressMap?.[lesson.id]}
                  locked={lesson.premiumOnly && !isUnlocked}
                />
              ))}

              {/* 道館（R3 實作） */}
              {gyms.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    道館挑戰
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gyms.map((gym) => (
                      <Card
                        key={gym.id}
                        padding="md"
                        className="border-2 border-orange-200 bg-orange-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                            道
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {gym.name}
                            </h5>
                            <p className="text-xs text-gray-600">
                              難度: {'⭐'.repeat(gym.difficulty)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              請先解鎖此章節
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default function ChapterList({
  chapters,
  progressMap,
  className,
}: ChapterListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          chapter={chapter}
          progressMap={progressMap}
        />
      ))}
    </div>
  )
}
