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
  name: string
  slug: string                // URL slug (e.g., "software-design-pattern")
  description?: string
  thumbnailUrl?: string       // 課程封面圖
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
  chapterId: number
  journeyId: number
  name: string
  description?: string
  premiumOnly: boolean       // 是否僅付費會員可觀看
  type: LessonType
  createdAt: number
  reward: Reward
  videoLength?: string       // 影片長度 (e.g., "08:33")
  videoUrl?: string          // 影片 URL (YouTube ID or HLS URL)
  order: number              // 單元順序
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
