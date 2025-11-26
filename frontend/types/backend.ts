/**
 * Backend API DTO Types
 *
 * These types match the Java backend DTOs exactly.
 * DO NOT modify these types - they reflect the backend contract.
 */

/**
 * CourseDTO - Backend response for course data
 * Maps to: backend/src/main/java/com/waterball/lms/model/dto/CourseDTO.java
 */
export interface CourseDTO {
  id: number
  title: string
  description: string
  thumbnailUrl: string
  isPremium: boolean
  totalLessons: number
  displayOrder: number
  price?: number
}

/**
 * LessonDTO - Backend response for lesson data
 * Maps to: backend/src/main/java/com/waterball/lms/model/dto/LessonDTO.java
 */
export interface LessonDTO {
  id: number
  courseId: number
  title: string
  description: string
  type: 'VIDEO' | 'SCROLL' | 'GOOGLE_FORM'
  videoUrl: string | null
  videoDuration: number | null
  content: string
  displayOrder: number
  experienceReward: number

  // Progress fields (populated from Progress entity)
  progressPercentage: number
  lastPosition: number
  isCompleted: boolean
  isSubmitted: boolean
}

/**
 * PurchaseDTO - Backend response for purchase data
 * Maps to: backend/src/main/java/com/waterball/lms/model/dto/PurchaseDTO.java
 */
export interface PurchaseDTO {
  id: number
  userId: number
  courseId: number
  courseTitle: string
  purchasePrice: number
  purchaseDate: string
  paymentStatus: string
  transactionId: string
}

/**
 * UserDTO - Backend response for user data
 * Maps to: backend/src/main/java/com/waterball/lms/model/dto/UserDTO.java
 */
export interface UserDTO {
  id: number
  email: string
  displayName: string
  role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  level: number
  experience: number
  isPremium: boolean
}

/**
 * AuthResponse - Backend authentication response
 */
export interface AuthResponse {
  accessToken: string
  tokenType: string
  user: UserDTO
}

/**
 * Progress update request
 */
export interface UpdateProgressRequest {
  lessonId: number
  position: number
  duration: number
}

/**
 * Progress update response
 */
export interface UpdateProgressResponse {
  lessonId: number
  progressPercentage: number
  lastPosition: number
  isCompleted: boolean
  isSubmitted: boolean
}

/**
 * Submit lesson request
 */
export interface SubmitLessonRequest {
  lessonId: number
}

/**
 * Submit lesson response
 */
export interface SubmitLessonResponse {
  lessonId: number
  isSubmitted: boolean
  experienceGained: number
  user: UserDTO
}
