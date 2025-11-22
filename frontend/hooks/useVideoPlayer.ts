/**
 * useVideoPlayer Hook
 *
 * 用於管理影片播放器狀態（R2 將整合 YouTube API）
 */

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  progress: number // 0-100
  volume: number // 0-1
  isMuted: boolean
  playbackRate: number
}

interface UseVideoPlayerReturn extends VideoPlayerState {
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setPlaybackRate: (rate: number) => void
  reset: () => void
}

/**
 * useVideoPlayer Hook
 *
 * R1: 基礎狀態管理
 * R2: 整合 YouTube IFrame API
 *
 * @param onProgress - 進度更新回調（每秒）
 * @param onComplete - 完成回調
 * @param autoSave - 是否自動保存進度（默認 true）
 *
 * @example
 * const player = useVideoPlayer(
 *   (progress) => console.log('Progress:', progress),
 *   () => console.log('Video completed!')
 * )
 *
 * <Button onClick={player.toggle}>
 *   {player.isPlaying ? 'Pause' : 'Play'}
 * </Button>
 */
export function useVideoPlayer(
  onProgress?: (progress: number) => void,
  onComplete?: () => void,
  autoSave: boolean = true
): UseVideoPlayerReturn {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
  })

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedTimeRef = useRef<number>(0)

  // 播放
  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }))

    // R2 TODO: 控制 YouTube Player
    // if (playerRef.current) {
    //   playerRef.current.playVideo()
    // }
  }, [])

  // 暫停
  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }))

    // R2 TODO: 控制 YouTube Player
    // if (playerRef.current) {
    //   playerRef.current.pauseVideo()
    // }
  }, [])

  // 切換播放/暫停
  const toggle = useCallback(() => {
    setState(prev => {
      const newIsPlaying = !prev.isPlaying
      // R2 TODO: 控制 YouTube Player
      return { ...prev, isPlaying: newIsPlaying }
    })
  }, [])

  // 跳轉到指定時間
  const seek = useCallback((time: number) => {
    setState(prev => {
      const newTime = Math.max(0, Math.min(time, prev.duration))
      const newProgress = prev.duration > 0 ? (newTime / prev.duration) * 100 : 0

      return {
        ...prev,
        currentTime: newTime,
        progress: newProgress,
      }
    })

    // R2 TODO: 控制 YouTube Player
    // if (playerRef.current) {
    //   playerRef.current.seekTo(time, true)
    // }
  }, [])

  // 設定音量
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    setState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }))

    // R2 TODO: 控制 YouTube Player
    // if (playerRef.current) {
    //   playerRef.current.setVolume(clampedVolume * 100)
    // }
  }, [])

  // 切換靜音
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newIsMuted = !prev.isMuted

      // R2 TODO: 控制 YouTube Player
      // if (playerRef.current) {
      //   if (newIsMuted) {
      //     playerRef.current.mute()
      //   } else {
      //     playerRef.current.unMute()
      //   }
      // }

      return { ...prev, isMuted: newIsMuted }
    })
  }, [])

  // 設定播放速度
  const setPlaybackRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, playbackRate: rate }))

    // R2 TODO: 控制 YouTube Player
    // if (playerRef.current) {
    //   playerRef.current.setPlaybackRate(rate)
    // }
  }, [])

  // 重置
  const reset = useCallback(() => {
    setState({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      volume: 1,
      isMuted: false,
      playbackRate: 1,
    })
  }, [])

  // 進度追蹤（每秒）
  useEffect(() => {
    if (!state.isPlaying || state.duration === 0) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      return
    }

    progressIntervalRef.current = setInterval(() => {
      setState(prev => {
        const newTime = prev.currentTime + 1
        const newProgress = (newTime / prev.duration) * 100

        // 檢查是否完成
        if (newTime >= prev.duration) {
          if (onComplete) {
            onComplete()
          }
          return {
            ...prev,
            currentTime: prev.duration,
            progress: 100,
            isPlaying: false,
          }
        }

        // 自動保存進度（每 10 秒）
        if (autoSave && onProgress && newTime - lastSavedTimeRef.current >= 10) {
          onProgress(newProgress)
          lastSavedTimeRef.current = newTime
        }

        return {
          ...prev,
          currentTime: newTime,
          progress: newProgress,
        }
      })
    }, 1000)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [state.isPlaying, state.duration, autoSave, onProgress, onComplete])

  return {
    ...state,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    reset,
  }
}
