/**
 * Chapter Grouping Utilities
 *
 * Generate chapter structure from flat lesson list
 * Backend has no chapters, but frontend UI requires them
 */

import type { LessonDTO } from '@/types/backend'
import type { Chapter, Lesson } from '@/types/journey'
import { convertLessonDTOToLesson } from './lessonConverter'

/**
 * Strategy for grouping lessons into chapters
 */
export type ChapterGroupingStrategy = 'fixed-size' | 'smart' | 'single'

/**
 * Generate chapters from flat lesson list
 * Uses specified grouping strategy
 */
export function generateChaptersFromLessons(
  lessons: LessonDTO[],
  courseId: number,
  strategy: ChapterGroupingStrategy = 'fixed-size'
): Chapter[] {
  switch (strategy) {
    case 'fixed-size':
      return generateFixedSizeChapters(lessons, courseId)
    case 'smart':
      return generateSmartChapters(lessons, courseId)
    case 'single':
      return generateSingleChapter(lessons, courseId)
    default:
      return generateFixedSizeChapters(lessons, courseId)
  }
}

/**
 * Strategy 1: Fixed Size Chapters
 * Group every N lessons into a chapter
 */
function generateFixedSizeChapters(
  lessons: LessonDTO[],
  courseId: number,
  lessonsPerChapter: number = 10
): Chapter[] {
  if (lessons.length === 0) return []

  const chapters: Chapter[] = []
  const sortedLessons = [...lessons].sort((a, b) => a.displayOrder - b.displayOrder)

  for (let i = 0; i < sortedLessons.length; i += lessonsPerChapter) {
    const chapterNumber = Math.floor(i / lessonsPerChapter) + 1
    const chapterLessons = sortedLessons.slice(i, i + lessonsPerChapter)
    const virtualChapterId = courseId * 1000 + chapterNumber

    chapters.push({
      id: virtualChapterId,
      name: `第 ${chapterNumber} 章`,
      journeyId: courseId,
      reward: {
        exp: chapterLessons.reduce((sum, l) => sum + (l.experienceReward || 0), 0),
        coin: 0,
        subscriptionExtensionInDays: 0,
        journeyId: courseId,
        externalRewardDescription: '',
      },
      passwordRequired: false,
      password: undefined,
      locked: false,
      lessons: chapterLessons.map((l) => convertLessonDTOToLesson(l, virtualChapterId)),
      gyms: [], // Empty for R1
      order: chapterNumber,
    })
  }

  return chapters
}

/**
 * Strategy 2: Smart Chapters
 * Try to detect natural groupings from lesson titles
 * E.g., "創建型模式 - 單例模式" → Group by prefix
 */
function generateSmartChapters(lessons: LessonDTO[], courseId: number): Chapter[] {
  if (lessons.length === 0) return []

  const sortedLessons = [...lessons].sort((a, b) => a.displayOrder - b.displayOrder)

  // Try to detect chapter boundaries
  const chapterGroups: LessonDTO[][] = []
  let currentGroup: LessonDTO[] = []
  let lastPrefix = ''

  for (const lesson of sortedLessons) {
    // Try to extract prefix (before first dash or colon)
    const prefix = extractTitlePrefix(lesson.title)

    if (prefix !== lastPrefix && currentGroup.length > 0) {
      // New chapter detected
      chapterGroups.push(currentGroup)
      currentGroup = [lesson]
      lastPrefix = prefix
    } else {
      currentGroup.push(lesson)
      if (!lastPrefix) lastPrefix = prefix
    }
  }

  // Add last group
  if (currentGroup.length > 0) {
    chapterGroups.push(currentGroup)
  }

  // If smart grouping didn't work well (only 1 group or too many groups),
  // fall back to fixed size
  if (chapterGroups.length === 1 || chapterGroups.length > lessons.length / 2) {
    return generateFixedSizeChapters(lessons, courseId)
  }

  // Convert groups to chapters
  return chapterGroups.map((group, index) => {
    const chapterNumber = index + 1
    const virtualChapterId = courseId * 1000 + chapterNumber
    const chapterName = extractTitlePrefix(group[0].title) || `第 ${chapterNumber} 章`

    return {
      id: virtualChapterId,
      name: chapterName,
      journeyId: courseId,
      reward: {
        exp: group.reduce((sum, l) => sum + (l.experienceReward || 0), 0),
        coin: 0,
        subscriptionExtensionInDays: 0,
        journeyId: courseId,
        externalRewardDescription: '',
      },
      passwordRequired: false,
      password: undefined,
      locked: false,
      lessons: group.map((l) => convertLessonDTOToLesson(l, virtualChapterId)),
      gyms: [],
      order: chapterNumber,
    }
  })
}

/**
 * Strategy 3: Single Chapter
 * Put all lessons in one chapter
 */
function generateSingleChapter(lessons: LessonDTO[], courseId: number): Chapter[] {
  if (lessons.length === 0) return []

  const sortedLessons = [...lessons].sort((a, b) => a.displayOrder - b.displayOrder)
  const virtualChapterId = courseId * 1000 + 1

  return [
    {
      id: virtualChapterId,
      name: '課程內容',
      journeyId: courseId,
      reward: {
        exp: sortedLessons.reduce((sum, l) => sum + (l.experienceReward || 0), 0),
        coin: 0,
        subscriptionExtensionInDays: 0,
        journeyId: courseId,
        externalRewardDescription: '',
      },
      passwordRequired: false,
      password: undefined,
      locked: false,
      lessons: sortedLessons.map((l) => convertLessonDTOToLesson(l, virtualChapterId)),
      gyms: [],
      order: 1,
    },
  ]
}

/**
 * Extract chapter-like prefix from lesson title
 * E.g., "創建型模式 - 單例模式" → "創建型模式"
 */
function extractTitlePrefix(title: string): string {
  // Try common separators
  const separators = [' - ', '：', ': ', '－', '—']

  for (const sep of separators) {
    if (title.includes(sep)) {
      return title.split(sep)[0].trim()
    }
  }

  // No separator found, return first few words
  const words = title.split(/\s+/)
  return words.slice(0, Math.min(3, words.length)).join(' ')
}

/**
 * Add chapters to lessons (mutates lesson objects)
 * Used when you have Lesson[] and need to add chapter grouping
 */
export function groupLessonsIntoChapters(
  lessons: Lesson[],
  courseId: number,
  strategy: ChapterGroupingStrategy = 'fixed-size'
): Chapter[] {
  // Convert Lessons to LessonDTO-like format for grouping
  const lessonDTOs: LessonDTO[] = lessons.map((lesson) => ({
    id: lesson.id,
    courseId: lesson.courseId || lesson.journeyId,
    title: lesson.title || lesson.name,
    description: lesson.description || '',
    type: (lesson.type?.toUpperCase() as 'VIDEO' | 'SCROLL' | 'GOOGLE_FORM') || 'VIDEO',
    videoUrl: lesson.videoUrl || null,
    videoDuration: lesson.videoDuration || null,
    content: lesson.content || '',
    displayOrder: lesson.displayOrder || lesson.order || 0,
    experienceReward: lesson.experienceReward || lesson.reward?.exp || 0,
    progressPercentage: lesson.progressPercentage || 0,
    lastPosition: lesson.lastPosition || 0,
    isCompleted: lesson.isCompleted || false,
    isSubmitted: lesson.isSubmitted || false,
  }))

  return generateChaptersFromLessons(lessonDTOs, courseId, strategy)
}
