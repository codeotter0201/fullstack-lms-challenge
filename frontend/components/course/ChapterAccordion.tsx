/**
 * ChapterAccordion 章節手風琴
 *
 * 可展開/收合的章節列表，支援副本命名與鎖定狀態
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Lock, CheckCircle2, Circle, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Chapter } from '@/types/journey'

interface ChapterAccordionProps {
  chapters: Chapter[]
  journeySlug: string
  currentLessonId?: number
  completedLessonIds?: number[]
  className?: string
}

export default function ChapterAccordion({
  chapters,
  journeySlug,
  currentLessonId,
  completedLessonIds = [],
  className,
}: ChapterAccordionProps) {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([])

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  // 判斷章節是否鎖定（簡化邏輯：第一章解鎖，其他根據前一章完成度）
  const isChapterLocked = (chapterIndex: number): boolean => {
    if (chapterIndex === 0) return false
    // 這裡可以加入更複雜的解鎖邏輯
    return false
  }

  return (
    <div className={cn('space-y-2', className)}>
      {chapters.map((chapter, chapterIndex) => {
        const isExpanded = expandedChapters.includes(chapter.id)
        const isLocked = isChapterLocked(chapterIndex)
        const chapterName = `副本${chapterIndex}：${chapter.name}`

        // 計算章節完成度
        const totalLessons = chapter.lessons?.length || 0
        const completedCount = chapter.lessons?.filter((lesson) =>
          completedLessonIds.includes(lesson.id)
        ).length || 0
        const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

        return (
          <div
            key={chapter.id}
            className={cn(
              'bg-background-tertiary border border-border rounded-lg overflow-hidden',
              'transition-all duration-200',
              isLocked && 'opacity-60'
            )}
          >
            {/* 章節標題 */}
            <button
              onClick={() => !isLocked && toggleChapter(chapter.id)}
              disabled={isLocked}
              className={cn(
                'w-full flex items-center gap-3 p-4',
                'text-left transition-colors',
                !isLocked && 'hover:bg-background-hover cursor-pointer',
                isLocked && 'cursor-not-allowed'
              )}
            >
              {/* 展開/收合圖示 */}
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-text-secondary transition-transform duration-200 flex-shrink-0',
                  isExpanded && 'rotate-180',
                  isLocked && 'opacity-50'
                )}
              />

              {/* 章節資訊 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isLocked && <Lock className="w-4 h-4 text-status-locked" />}
                  <h3 className={cn(
                    'text-sm font-semibold',
                    isLocked ? 'text-text-muted' : 'text-text-primary'
                  )}>
                    {chapterName}
                  </h3>
                </div>

                {/* 進度條 */}
                {!isLocked && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{completedCount} / {totalLessons} 已完成</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-1.5 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-dark to-primary rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 完成徽章 */}
              {progressPercent === 100 && (
                <CheckCircle2 className="w-5 h-5 text-status-success flex-shrink-0" />
              )}
            </button>

            {/* 課程單元列表 */}
            {isExpanded && !isLocked && (
              <div className="border-t border-border">
                {chapter.lessons && chapter.lessons.length > 0 ? (
                  <div className="divide-y divide-border">
                    {chapter.lessons.map((lesson, lessonIndex) => {
                      const isCompleted = completedLessonIds.includes(lesson.id)
                      const isCurrent = currentLessonId === lesson.id

                      return (
                        <Link
                          key={lesson.id}
                          href={`/journeys/${journeySlug}/chapters/${chapter.id}/missions/${lesson.id}`}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3',
                            'hover:bg-background-hover transition-colors',
                            isCurrent && 'bg-background-hover border-l-2 border-primary'
                          )}
                        >
                          {/* 狀態圖示 */}
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-status-success" />
                            ) : isCurrent ? (
                              <PlayCircle className="w-5 h-5 text-primary" />
                            ) : (
                              <Circle className="w-5 h-5 text-text-disabled" />
                            )}
                          </div>

                          {/* 單元資訊 */}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm font-medium truncate',
                              isCurrent ? 'text-primary' :
                              isCompleted ? 'text-text-primary' :
                              'text-text-secondary'
                            )}>
                              {lessonIndex + 1}. {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-xs text-text-muted mt-0.5">
                                {lesson.duration} 分鐘
                              </p>
                            )}
                          </div>

                          {/* 類型標籤 */}
                          {lesson.type && (
                            <span className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              lesson.type === 'video' && 'bg-status-info/20 text-status-info',
                              lesson.type === 'quiz' && 'bg-status-warning/20 text-status-warning',
                              lesson.type === 'practice' && 'bg-primary/20 text-primary'
                            )}>
                              {lesson.type === 'video' && '影片'}
                              {lesson.type === 'quiz' && '測驗'}
                              {lesson.type === 'practice' && '練習'}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-text-muted">此章節尚無課程單元</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
