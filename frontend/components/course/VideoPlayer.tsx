/**
 * VideoPlayer 影片播放器元件
 *
 * R2: 整合 YouTube IFrame API
 * - 真實追蹤影片播放進度
 * - 每 10 秒自動保存進度
 * - 偵測影片完成（95% threshold）
 * - 防禦性檢查：拒絕 null 或空的 videoId
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Card, Spinner } from '@/components/ui'

interface VideoPlayerProps {
  videoId: string
  title?: string
  autoplay?: boolean
  initialPosition?: number // 初始播放位置（秒）
  onProgress?: (progress: { currentTime: number; duration: number; percentage: number }) => void
  onComplete?: () => void
  className?: string
}

// YouTube Player 類型定義
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function VideoPlayer({
  videoId,
  title,
  autoplay = false,
  initialPosition = 0,
  onProgress,
  onComplete,
  className,
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastReportedPositionRef = useRef<number>(0)

  // 載入 YouTube IFrame API
  useEffect(() => {
    // Validate videoId FIRST before doing anything
    if (!videoId || videoId.trim() === '') {
      console.error('Invalid or empty video ID:', videoId)
      setError('影片 ID 無效')
      setIsLoading(false)
      return
    }

    // 檢查 API 是否已載入
    if (window.YT && window.YT.Player) {
      initializePlayer()
      return
    }

    // 檢查 script 是否已經在載入中
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]')
    if (existingScript) {
      // Script 正在載入，等待 onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = initializePlayer
      return
    }

    // 載入 YouTube IFrame API script
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    document.head.appendChild(tag)

    // 設置 API 就緒回調
    window.onYouTubeIframeAPIReady = initializePlayer

    return () => {
      // 清理
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [videoId])

  // 初始化 YouTube Player
  const initializePlayer = () => {
    if (!playerContainerRef.current) return

    // Validate videoId before initializing
    if (!videoId || videoId.trim() === '') {
      console.error('Invalid or empty video ID:', videoId)
      setError('影片 ID 無效')
      setIsLoading(false)
      return
    }

    try {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          start: initialPosition || 0,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
          onError: handlePlayerError,
        },
      })
    } catch (err) {
      console.error('Failed to initialize YouTube player:', err)
      setError('影片播放器初始化失敗')
      setIsLoading(false)
    }
  }

  // Player 就緒
  const handlePlayerReady = (event: any) => {
    setIsLoading(false)

    // 如果有初始位置，跳轉到該位置
    if (initialPosition > 0) {
      event.target.seekTo(initialPosition, true)
    }

    // 開始追蹤進度（每 10 秒）
    startProgressTracking()
  }

  // Player 狀態改變
  const handlePlayerStateChange = (event: any) => {
    const playerState = event.data

    // YT.PlayerState.PLAYING = 1
    if (playerState === 1) {
      startProgressTracking()
    }

    // YT.PlayerState.PAUSED = 2 或 ENDED = 0
    if (playerState === 2 || playerState === 0) {
      // 暫停時也要保存進度
      reportProgress()

      // 停止定時追蹤（但保持可以手動觸發）
      if (playerState === 2 && progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }

    // YT.PlayerState.ENDED = 0
    if (playerState === 0) {
      handleVideoEnded()
    }
  }

  // Player 錯誤
  const handlePlayerError = (event: any) => {
    console.error('YouTube player error:', event.data)
    setError('影片載入失敗')
    setIsLoading(false)
  }

  // 開始追蹤進度
  const startProgressTracking = () => {
    // 避免重複啟動
    if (progressIntervalRef.current) {
      return
    }

    // 每 10 秒報告進度
    progressIntervalRef.current = setInterval(() => {
      reportProgress()
    }, 10000)
  }

  // 報告當前進度
  const reportProgress = () => {
    if (!playerRef.current || !onProgress) return

    try {
      const currentTime = playerRef.current.getCurrentTime()
      const duration = playerRef.current.getDuration()

      if (!currentTime || !duration || duration === 0) return

      const percentage = Math.min((currentTime / duration) * 100, 100)

      // 避免重複報告相同位置（容差 2 秒）
      if (Math.abs(currentTime - lastReportedPositionRef.current) < 2) {
        return
      }

      lastReportedPositionRef.current = currentTime

      // 回調進度
      onProgress({
        currentTime: Math.floor(currentTime),
        duration: Math.floor(duration),
        percentage: Math.floor(percentage),
      })

      // 檢查是否達到完成條件（95% 以上）
      if (percentage >= 95 && !isCompleted) {
        handleVideoCompleted()
      }
    } catch (err) {
      console.error('Failed to report progress:', err)
    }
  }

  // 影片完成（達到 95% threshold）
  const handleVideoCompleted = () => {
    if (isCompleted) return // 避免重複觸發

    setIsCompleted(true)

    if (onComplete) {
      onComplete()
    }
  }

  // 影片結束（播放到最後）
  const handleVideoEnded = () => {
    // 最後報告一次 100% 進度
    if (onProgress) {
      const duration = playerRef.current?.getDuration()
      if (duration) {
        onProgress({
          currentTime: Math.floor(duration),
          duration: Math.floor(duration),
          percentage: 100,
        })
      }
    }

    handleVideoCompleted()

    // 清理定時器
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  // 組件卸載時清理
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }

      // 卸載前保存最後的進度
      reportProgress()

      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [])

  return (
    <Card padding="none" className={cn('overflow-hidden bg-black', className)}>
      {/* 影片容器 */}
      <div className="relative aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <Spinner size="lg" color="text-white" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-white">
              <p className="text-lg font-medium mb-2">影片載入失敗</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        )}

        {/* YouTube Player Container */}
        <div
          ref={playerContainerRef}
          className="w-full h-full"
        />
      </div>
    </Card>
  )
}
