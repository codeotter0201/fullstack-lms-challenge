/**
 * JourneySwitcher 課程切換下拉選單
 *
 * 顯示當前課程名稱，支援快速切換課程
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, BookOpen, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Journey } from '@/types/journey'

interface JourneySwitcherProps {
  currentJourney?: Journey
  ownedJourneys?: Journey[]
  className?: string
}

export default function JourneySwitcher({
  currentJourney,
  ownedJourneys = [],
  className,
}: JourneySwitcherProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleJourneyChange = (journey: Journey) => {
    setIsOpen(false)
    router.push(`/journeys/${journey.slug}`)
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* 當前課程按鈕 - 符合目標網站設計 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-6 py-3 rounded-lg',
          'bg-[#2D3142] border border-[#3D4152]',
          'text-base font-medium text-white',
          'hover:border-primary/50 hover:bg-[#3D4152]',
          'transition-all duration-200',
          'min-w-[320px] max-w-[500px]'
        )}
      >
        <span className="flex-1 text-left truncate">
          {currentJourney?.name || '選擇課程'}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-secondary transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-2 w-full min-w-[280px]',
            'bg-background-tertiary border border-border rounded-lg shadow-xl',
            'z-dropdown',
            'animate-slide-in-down'
          )}
        >
          {/* 標題 */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-medium text-text-muted">我的課程</p>
          </div>

          {/* 課程列表 */}
          <div className="py-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {ownedJourneys.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-text-muted">尚未擁有任何課程</p>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/courses')
                  }}
                  className="mt-2 text-sm text-primary hover:text-primary-dark"
                >
                  瀏覽課程
                </button>
              </div>
            ) : (
              ownedJourneys.map((journey) => {
                const isSelected = currentJourney?.id === journey.id

                return (
                  <button
                    key={journey.id}
                    onClick={() => handleJourneyChange(journey)}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3',
                      'hover:bg-background-hover transition-colors',
                      'text-left',
                      isSelected && 'bg-background-hover'
                    )}
                  >
                    {/* 課程圖示 */}
                    <div className="w-10 h-10 rounded-lg bg-background-secondary flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>

                    {/* 課程資訊 */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        isSelected ? 'text-primary' : 'text-text-primary'
                      )}>
                        {journey.name}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {journey.chapters?.length || 0} 個章節
                      </p>
                    </div>

                    {/* 選中指示器 */}
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* 底部操作 */}
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/courses')
              }}
              className="w-full text-sm text-center text-primary hover:text-primary-dark transition-colors"
            >
              查看所有課程
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
