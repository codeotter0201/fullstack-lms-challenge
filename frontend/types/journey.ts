/**
 * 課程/旅程相關型別定義
 *
 * 定義課程、章節、技能、獎勵等相關型別
 */

/**
 * 獎勵
 */
export interface Reward {
  exp: number                          // 經驗值
  coin: number                         // 金幣 (R1 未使用)
  subscriptionExtensionInDays: number  // 訂閱延長天數 (R1 未使用)
  journeyId: number
  externalRewardDescription: string    // 外部獎勵描述
}

/**
 * 技能
 */
export interface Skill {
  id: number
  name: string
  description?: string
}

/**
 * 課程/旅程
 */
export interface Journey {
  id: number
  title?: string             // 課程標題 (from backend)
  name: string               // 課程名稱 (legacy, same as title)
  slug: string               // URL slug (e.g., "software-design-pattern")
  description?: string
  thumbnailUrl?: string      // 課程封面圖
  imageUrl?: string          // 課程圖片 URL (與 thumbnailUrl 同義)
  createdAt: number          // 時間戳
  skills: Skill[]
  chapters: Chapter[]
  missions: Mission[]        // 獎勵任務 (R2 實作)

  // 課程資訊
  author: string             // 作者 (e.g., "水球潘")
  videoCount: number         // 影片數量
  isPremium: boolean         // 是否為付費課程
  hasDiscount: boolean       // 是否有折價券
  discountAmount?: number    // 折價金額

  // Backend fields
  price?: number             // 課程價格 (from backend)
  displayOrder?: number      // 顯示順序 (from backend)
  totalLessons?: number      // 總單元數 (from backend, same as videoCount)
}

/**
 * 章節/副本
 */
export interface Chapter {
  id: number
  name: string
  journeyId: number
  reward: Reward
  passwordRequired: boolean  // 是否需要密碼解鎖
  lessons: Lesson[]
  gyms: Gym[]               // 道館 (R3 實作)
  order: number             // 章節順序
}

/**
 * 課程單元類型
 */
export enum LessonType {
  VIDEO = 'video',           // 影片
  SCROLL = 'scroll',         // 文章
  GOOGLE_FORM = 'google-form', // 問卷
}

/**
 * 道館類型
 */
export enum GymType {
  WHITE = 'white',           // 白段
  BLACK = 'black',           // 黑段
}

/**
 * 課程單元
 */
export interface Lesson {
  id: number
  chapterId?: number         // 章節 ID (frontend virtual, optional)
  journeyId?: number         // 課程 ID (legacy, same as courseId)
  courseId?: number          // 課程 ID (from backend)
  title?: string             // 單元標題 (from backend)
  name: string               // 單元名稱 (legacy, same as title)
  description?: string
  premiumOnly?: boolean      // 是否僅付費會員可觀看
  type: LessonType | string  // 單元類型
  createdAt?: number         // 時間戳
  reward?: Reward            // 獎勵物件 (legacy)
  experienceReward?: number  // 經驗值獎勵 (from backend)
  videoLength?: string       // 影片長度 (e.g., "08:33", formatted)
  videoDuration?: number     // 影片時長 (秒數, from backend)
  videoUrl?: string          // 影片 URL (YouTube ID or full URL)
  content?: string           // 內容 (from backend)
  order?: number             // 單元順序 (legacy)
  displayOrder?: number      // 顯示順序 (from backend)

  // Progress fields (from backend)
  progressPercentage?: number // 進度百分比
  lastPosition?: number       // 最後播放位置 (秒數)
  isCompleted?: boolean       // 是否完成
  isSubmitted?: boolean       // 是否已繳交
}

/**
 * 道館 (R3 實作)
 */
export interface Gym {
  id: number
  name: string
  description?: string
  difficulty: number         // 難度 (1-5 星)
  chapterId: number
  journeyId: number
  type: 'white' | 'black'    // 白段 or 黑段
  reward: Reward
  order: number
}

/**
 * 道館徽章 (R3 實作)
 */
export interface GymBadge {
  id: number
  name: string
  gymId: number
  imageUrl: string
  journeyId: number
  chapterId: number
}

/**
 * 獎勵任務 (R2 實作)
 */
export interface Mission {
  id: number
  name: string
  description: string
  journeyId: number
  reward: Reward
  requirements: MissionRequirement[]
}

/**
 * 任務需求 (R2 實作)
 */
export interface MissionRequirement {
  type: 'complete_lessons' | 'earn_exp' | 'earn_badges'
  target: number
  current: number
}

/**
 * 課程 Slug 映射表
 */
export type JourneySlugMapping = Record<string, string>

/**
 * 課程擁有狀態
 */
export interface JourneyOwnership {
  journeyId: number
  owned: boolean
  expiresAt?: number  // 訂閱到期時間 (時間戳)
}

/**
 * 用戶課程狀態
 */
export interface UserJourneyStatus {
  orders: JourneyOwnership[]
}
