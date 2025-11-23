/**
 * DTO Transformation Layer
 *
 * Converts backend DTOs to frontend types.
 * This layer handles field name differences and data structure transformations.
 */

import type { CourseDTO, LessonDTO } from '@/types/backend'
import type { Journey, Lesson } from '@/types/journey'
import { convertLessonDTOToLesson, convertLessonDTOsToLessons } from '@/lib/utils/lessonConverter'
import { generateChaptersFromLessons } from '@/lib/utils/chapterGrouping'

/**
 * Transform CourseDTO (backend) to Journey (frontend)
 * Can optionally include lessons to generate chapters
 */
export function transformCourseToJourney(
  course: CourseDTO,
  lessons?: LessonDTO[]
): Journey {
  const journey: Journey = {
    id: course.id,
    title: course.title, // Keep as title (primary)
    name: course.title, // Backward compatibility
    slug: String(course.id), // Use course ID as slug (e.g., "1", "2", "3")
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    imageUrl: course.thumbnailUrl, // Use thumbnailUrl for both
    createdAt: Date.now(), // Backend doesn't provide, use current timestamp
    skills: [], // Not provided by backend, will be empty for now
    chapters: [], // Generated below if lessons provided
    missions: [], // Populated below if lessons provided
    author: 'Waterball Academy', // Backend doesn't provide, use default
    videoCount: course.totalLessons, // totalLessons → videoCount
    isPremium: course.isPremium,
    hasDiscount: false, // Backend doesn't provide discount info
    discountAmount: undefined,
  }

  // If lessons are provided, generate chapters and populate missions
  if (lessons && lessons.length > 0) {
    journey.chapters = generateChaptersFromLessons(lessons, course.id, 'fixed-size')
    journey.missions = convertLessonDTOsToLessons(lessons)
  }

  return journey
}

/**
 * Transform LessonDTO (backend) to Lesson (frontend)
 * Delegates to utility function for consistency
 */
export function transformLessonDTO(lessonDTO: LessonDTO, virtualChapterId?: number): Lesson {
  return convertLessonDTOToLesson(lessonDTO, virtualChapterId)
}

/**
 * Transform array of CourseDTO to array of Journey
 */
export function transformCourses(courses: CourseDTO[]): Journey[] {
  return courses.map(transformCourseToJourney)
}

/**
 * Transform array of LessonDTO to array of Lesson
 */
export function transformLessons(lessons: LessonDTO[], virtualChapterId?: number): Lesson[] {
  return convertLessonDTOsToLessons(lessons, virtualChapterId)
}
