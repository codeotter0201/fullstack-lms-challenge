/**
 * Lesson Converter Utilities
 *
 * Convert between backend LessonDTO and frontend Lesson types
 * Handle field name differences and data transformations
 */

import type { LessonDTO } from '@/types/backend'
import type { Lesson, LessonType, Reward } from '@/types/journey'

/**
 * Convert backend LessonDTO to frontend Lesson type
 * Handles field mapping and adds virtual fields for UI compatibility
 */
export function convertLessonDTOToLesson(
  dto: LessonDTO,
  virtualChapterId?: number
): Lesson {
  return {
    id: dto.id,
    courseId: dto.courseId,
    chapterId: virtualChapterId || dto.courseId * 1000, // Virtual chapter ID
    journeyId: dto.courseId, // Alias for backward compatibility
    title: dto.title,
    name: dto.title, // Backward compatibility
    description: dto.description,
    type: mapLessonType(dto.type),
    videoUrl: dto.videoUrl || undefined,
    videoDuration: dto.videoDuration || undefined,
    videoLength: formatVideoDuration(dto.videoDuration), // Formatted for display
    content: dto.content,
    displayOrder: dto.displayOrder,
    order: dto.displayOrder, // Backward compatibility
    experienceReward: dto.experienceReward,
    reward: createRewardObject(dto.experienceReward, dto.courseId), // Backward compatibility

    // Progress fields from backend
    progressPercentage: dto.progressPercentage,
    lastPosition: dto.lastPosition,
    isCompleted: dto.isCompleted,
    isSubmitted: dto.isSubmitted,

    // Frontend computed fields
    premiumOnly: false, // Determined by course.isPremium + purchase check
    createdAt: Date.now(), // Not from backend
  }
}

/**
 * Map backend lesson type to frontend LessonType
 */
function mapLessonType(backendType: 'VIDEO' | 'SCROLL' | 'GOOGLE_FORM'): LessonType {
  const typeMap: Record<string, LessonType> = {
    VIDEO: 'video',
    SCROLL: 'scroll',
    GOOGLE_FORM: 'google-form',
  }
  return typeMap[backendType] || 'video'
}

/**
 * Create Reward object from experience reward number
 * For backward compatibility with components expecting Reward object
 */
function createRewardObject(experienceReward: number, courseId: number): Reward {
  return {
    exp: experienceReward || 0,
    coin: 0, // Backend doesn't have coin rewards yet
    subscriptionExtensionInDays: 0,
    journeyId: courseId,
    externalRewardDescription: '',
  }
}

/**
 * Format video duration from seconds to "MM:SS" display format
 */
export function formatVideoDuration(seconds?: number | null): string {
  if (!seconds) return '00:00'

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Parse video duration from "MM:SS" format to seconds
 */
export function parseVideoDuration(formatted?: string): number {
  if (!formatted) return 0

  const parts = formatted.split(':')
  if (parts.length !== 2) return 0

  const mins = parseInt(parts[0], 10) || 0
  const secs = parseInt(parts[1], 10) || 0

  return mins * 60 + secs
}

/**
 * Extract YouTube video ID from full URL
 * Supports formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - VIDEO_ID (already just ID)
 */
export function extractYouTubeId(url?: string): string | undefined {
  if (!url) return undefined

  // If it's already just an ID (no slashes or query params)
  if (!url.includes('/') && !url.includes('?')) {
    return url
  }

  // Try to extract from full URL
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/, // youtube.com/watch?v=ID
    /(?:youtu\.be\/)([^?]+)/, // youtu.be/ID
    /(?:youtube\.com\/embed\/)([^?]+)/, // youtube.com/embed/ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return undefined
}

/**
 * Build full YouTube URL from video ID
 */
export function buildYouTubeUrl(videoId?: string): string | undefined {
  if (!videoId) return undefined

  // If it's already a full URL, return as-is
  if (videoId.startsWith('http://') || videoId.startsWith('https://')) {
    return videoId
  }

  // Build YouTube URL from ID
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * Convert array of LessonDTO to array of Lesson
 */
export function convertLessonDTOsToLessons(
  dtos: LessonDTO[],
  virtualChapterId?: number
): Lesson[] {
  return dtos.map((dto) => convertLessonDTOToLesson(dto, virtualChapterId))
}
