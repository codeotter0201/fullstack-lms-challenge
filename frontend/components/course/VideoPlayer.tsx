/**
 * VideoPlayer 影片播放器元件
 *
 * 預留 YouTube IFrame API 整合（R2）
 * 目前使用基本的 iframe 實作
 */

'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card, Spinner } from '@/components/ui'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'

interface VideoPlayerProps {
  videoId: string
  title?: string
  autoplay?: boolean
  onProgress?: (progress: { currentTime: number; duration: number; percentage: number }) => void
  onComplete?: () => void
  className?: string
}

export default function VideoPlayer({
  videoId,
  title,
  autoplay = false,
  onProgress,
  onComplete,
  className,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: R2 實作 YouTube IFrame API
  // - 載入 YouTube API
  // - 追蹤播放進度
  // - 自動儲存進度
  // - 完成時觸發 onComplete

  useEffect(() => {
    // 模擬載入
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [videoId])

  // 模擬進度更新（R2 用 YouTube API 取代）
  useEffect(() => {
    if (!isLoading && onProgress) {
      const interval = setInterval(() => {
        // TODO: 從 YouTube Player 獲取實際進度
        const mockProgress = {
          currentTime: 30,
          duration: 100,
          percentage: 30,
        }
        onProgress(mockProgress)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isLoading, onProgress])

  return (
    <Card padding="none" className={cn('overflow-hidden bg-black', className)}>
      {/* 影片容器 */}
      <div className="relative aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Spinner size="lg" color="text-white" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <p className="text-lg font-medium mb-2">影片載入失敗</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        )}

        {/* YouTube IFrame */}
        {!error && (
          <iframe
            className={cn(
              'w-full h-full',
              isLoading && 'opacity-0'
            )}
            src={`https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`}
            title={title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setError('無法載入影片')
            }}
          />
        )}
      </div>

      {/* 控制列（R2 用 YouTube API 自訂控制列） */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 播放/暫停（R2 實作） */}
            <button
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled
              title="R2 實作"
            >
              <Play className="w-5 h-5" />
            </button>

            {/* 音量（R2 實作） */}
            <button
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled
              title="R2 實作"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* 時間顯示（R2 實作） */}
            <span className="text-sm text-gray-400">
              --:-- / --:--
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* 全螢幕（R2 實作） */}
            <button
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              disabled
              title="R2 實作"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 開發提示 */}
      <div className="bg-yellow-50 border-t border-yellow-200 p-3">
        <p className="text-xs text-yellow-800">
          <strong>開發提示:</strong> YouTube IFrame API 整合將在 R2 實作，
          包括進度追蹤、自動儲存、完成檢測等功能。
        </p>
      </div>
    </Card>
  )
}
