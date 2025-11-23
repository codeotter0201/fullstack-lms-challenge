/**
 * Mock 課程資料
 *
 * 提供測試用的課程、章節、單元資料
 */

import {
  Journey,
  Chapter,
  Lesson,
  Skill,
  Reward,
  LessonType,
  Gym,
  GymType,
  Mission,
} from '@/types/journey'

/**
 * Mock 技能列表
 */
export const mockSkills: Skill[] = [
  { id: 1, name: '物件導向設計', description: 'Object-Oriented Design' },
  { id: 2, name: '設計模式', description: 'Design Patterns' },
  { id: 3, name: '軟體架構', description: 'Software Architecture' },
  { id: 4, name: '重構技巧', description: 'Refactoring' },
  { id: 5, name: 'Clean Code', description: '乾淨的程式碼' },
  { id: 6, name: 'SOLID 原則', description: 'SOLID Principles' },
  { id: 7, name: 'TDD', description: 'Test-Driven Development' },
  { id: 8, name: 'DDD', description: 'Domain-Driven Design' },
]

/**
 * Mock 獎勵 (預設值)
 */
function createReward(exp: number, journeyId: number): Reward {
  return {
    exp,
    coin: 0,
    subscriptionExtensionInDays: 0,
    journeyId,
    externalRewardDescription: '',
  }
}

/**
 * Mock 課程: 軟體設計模式
 */
const softwareDesignPatternJourney: Journey = {
  id: 1,
  name: '物件導向設計模式',
  slug: 'software-design-pattern',
  description: '深入學習 23 種經典設計模式，掌握物件導向程式設計的精髓。透過豐富的實戰案例，讓你能在實務開發中靈活運用，寫出優雅、可維護的程式碼。',
  thumbnailUrl: '/world/courses/course_0.png',
  imageUrl: '/world/courses/course_0.png',
  createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 天前
  skills: [mockSkills[0], mockSkills[1], mockSkills[3]],
  chapters: [],
  missions: [],
  author: '水球潘',
  videoCount: 48,
  isPremium: true,
  hasDiscount: true,
  discountAmount: 500,
}

// 章節 1: 創建型模式
const chapter1: Chapter = {
  id: 1,
  name: '創建型模式 (Creational Patterns)',
  journeyId: 1,
  reward: createReward(500, 1),
  passwordRequired: false,
  lessons: [],
  gyms: [],
  order: 1,
}

// 章節 1 的單元
chapter1.lessons = [
  {
    id: 1,
    chapterId: 1,
    journeyId: 1,
    name: '單例模式 (Singleton Pattern)',
    description: '確保一個類別只有一個實例，並提供全域存取點',
    premiumOnly: false,
    type: LessonType.VIDEO,
    createdAt: Date.now() - 85 * 24 * 60 * 60 * 1000,
    reward: createReward(100, 1),
    videoLength: '12:45',
    videoUrl: 'dQw4w9WgXcQ', // YouTube ID (mock)
    order: 1,
  },
  {
    id: 2,
    chapterId: 1,
    journeyId: 1,
    name: '工廠模式 (Factory Pattern)',
    description: '定義創建物件的介面，讓子類別決定實例化哪一個類別',
    premiumOnly: false,
    type: LessonType.VIDEO,
    createdAt: Date.now() - 84 * 24 * 60 * 60 * 1000,
    reward: createReward(100, 1),
    videoLength: '15:30',
    videoUrl: 'dQw4w9WgXcQ',
    order: 2,
  },
  {
    id: 3,
    chapterId: 1,
    journeyId: 1,
    name: '抽象工廠模式 (Abstract Factory)',
    description: '提供介面來創建相關或依賴物件的家族',
    premiumOnly: true,
    type: LessonType.VIDEO,
    createdAt: Date.now() - 83 * 24 * 60 * 60 * 1000,
    reward: createReward(150, 1),
    videoLength: '18:20',
    videoUrl: 'dQw4w9WgXcQ',
    order: 3,
  },
  {
    id: 4,
    chapterId: 1,
    journeyId: 1,
    name: '建造者模式 (Builder Pattern)',
    description: '將複雜物件的建構與表示分離',
    premiumOnly: true,
    type: LessonType.VIDEO,
    createdAt: Date.now() - 82 * 24 * 60 * 60 * 1000,
    reward: createReward(150, 1),
    videoLength: '16:15',
    videoUrl: 'dQw4w9WgXcQ',
    order: 4,
  },
]

// 章節 1 的道館 (R3)
chapter1.gyms = [
  {
    id: 1,
    name: '創建型模式實戰',
    description: '綜合運用創建型模式解決實際問題',
    difficulty: 3,
    chapterId: 1,
    journeyId: 1,
    type: GymType.WHITE,
    reward: createReward(300, 1),
    order: 1,
  },
]

// 章節 2: 結構型模式
const chapter2: Chapter = {
  id: 2,
  name: '結構型模式 (Structural Patterns)',
  journeyId: 1,
  reward: createReward(500, 1),
  passwordRequired: true,
  lessons: [],
  gyms: [],
  order: 2,
}

chapter2.lessons = [
  {
    id: 5,
    chapterId: 2,
    journeyId: 1,
    name: '適配器模式 (Adapter Pattern)',
    description: '將一個類別的介面轉換成客戶期望的另一個介面',
    premiumOnly: true,
    type: LessonType.VIDEO,
    createdAt: Date.now() - 80 * 24 * 60 * 60 * 1000,
    reward: createReward(150, 1),
    videoLength: '14:40',
    videoUrl: 'dQw4w9WgXcQ',
    order: 1,
  },
  {
    id: 6,
    chapterId: 2,
    journeyId: 1,
    name: '裝飾者模式 (Decorator Pattern)',
    description: '動態地為物件添加額外的職責',
    premiumOnly: true,
    type: LessonType.VIDEO,
    createdAt: Date.now() - 79 * 24 * 60 * 60 * 1000,
    reward: createReward(150, 1),
    videoLength: '17:25',
    videoUrl: 'dQw4w9WgXcQ',
    order: 2,
  },
  {
    id: 7,
    chapterId: 2,
    journeyId: 1,
    name: '代理模式 (Proxy Pattern)',
    description: '為其他物件提供一種代理以控制對這個物件的存取',
    premiumOnly: true,
    type: LessonType.VIDEO,
    createdAt: Date.now() - 78 * 24 * 60 * 60 * 1000,
    reward: createReward(150, 1),
    videoLength: '13:55',
    videoUrl: 'dQw4w9WgXcQ',
    order: 3,
  },
]

chapter2.gyms = [
  {
    id: 2,
    name: '結構型模式挑戰',
    description: '運用結構型模式優化系統架構',
    difficulty: 4,
    chapterId: 2,
    journeyId: 1,
    type: GymType.BLACK,
    reward: createReward(500, 1),
    order: 1,
  },
]

// 將章節加入課程
softwareDesignPatternJourney.chapters = [chapter1, chapter2]

/**
 * Mock 課程: Clean Code 實踐
 */
const cleanCodeJourney: Journey = {
  id: 2,
  name: 'Clean Code 整潔的程式碼',
  slug: 'clean-code',
  description: '掌握撰寫高品質程式碼的技巧,讓你的程式碼更易讀、易懂、易維護。從命名、函式設計到註解撰寫，全方位提升你的程式碼品質。',
  thumbnailUrl: '/world/courses/course_4.png',
  imageUrl: '/world/courses/course_4.png',
  createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  skills: [mockSkills[4], mockSkills[5], mockSkills[6]],
  chapters: [],
  missions: [],
  author: '水球潘',
  videoCount: 32,
  isPremium: false,
  hasDiscount: false,
}

const cleanCodeChapter1: Chapter = {
  id: 3,
  name: 'Clean Code 基礎',
  journeyId: 2,
  reward: createReward(300, 2),
  passwordRequired: false,
  lessons: [
    {
      id: 8,
      chapterId: 3,
      journeyId: 2,
      name: '有意義的命名',
      description: '如何為變數、函式、類別命名',
      premiumOnly: false,
      type: LessonType.VIDEO,
      createdAt: Date.now() - 55 * 24 * 60 * 60 * 1000,
      reward: createReward(100, 2),
      videoLength: '10:30',
      videoUrl: 'dQw4w9WgXcQ',
      order: 1,
    },
    {
      id: 9,
      chapterId: 3,
      journeyId: 2,
      name: '函式設計原則',
      description: '撰寫簡潔函式的技巧',
      premiumOnly: false,
      type: LessonType.VIDEO,
      createdAt: Date.now() - 54 * 24 * 60 * 60 * 1000,
      reward: createReward(100, 2),
      videoLength: '12:15',
      videoUrl: 'dQw4w9WgXcQ',
      order: 2,
    },
  ],
  gyms: [],
  order: 1,
}

cleanCodeJourney.chapters = [cleanCodeChapter1]

/**
 * Mock 課程列表
 */
export const mockJourneys: Journey[] = [
  softwareDesignPatternJourney,
  cleanCodeJourney,
]

/**
 * 根據 ID 獲取課程
 */
export function getJourneyById(id: number): Journey | undefined {
  return mockJourneys.find(j => j.id === id)
}

/**
 * 根據 slug 獲取課程
 */
export function getJourneyBySlug(slug: string): Journey | undefined {
  return mockJourneys.find(j => j.slug === slug)
}

/**
 * 獲取課程的所有單元
 */
export function getAllLessonsInJourney(journeyId: number): Lesson[] {
  const journey = getJourneyById(journeyId)
  if (!journey) return []

  return journey.chapters.flatMap(chapter => chapter.lessons)
}

/**
 * 根據 ID 獲取單元
 */
export function getLessonById(lessonId: number): Lesson | undefined {
  for (const journey of mockJourneys) {
    for (const chapter of journey.chapters) {
      const lesson = chapter.lessons.find(l => l.id === lessonId)
      if (lesson) return lesson
    }
  }
  return undefined
}

/**
 * 獲取課程的所有道館
 */
export function getAllGymsInJourney(journeyId: number): Gym[] {
  const journey = getJourneyById(journeyId)
  if (!journey) return []

  return journey.chapters.flatMap(chapter => chapter.gyms)
}

/**
 * 根據 ID 獲取道館
 */
export function getGymById(gymId: number): Gym | undefined {
  for (const journey of mockJourneys) {
    for (const chapter of journey.chapters) {
      const gym = chapter.gyms.find(g => g.id === gymId)
      if (gym) return gym
    }
  }
  return undefined
}

/**
 * Mock 課程擁有狀態
 */
export const mockJourneyOwnership = {
  1: { // 用戶 1 (免費學員)
    1: { journeyId: 1, owned: false }, // 付費課程未擁有
    2: { journeyId: 2, owned: true },  // 免費課程擁有
  },
  2: { // 用戶 2 (付費學員)
    1: { journeyId: 1, owned: true, expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000 },
    2: { journeyId: 2, owned: true },
  },
  3: { // 用戶 3 (老師)
    1: { journeyId: 1, owned: true },
    2: { journeyId: 2, owned: true },
  },
}

/**
 * 檢查用戶是否擁有課程
 */
export function hasJourneyAccess(userId: number, journeyId: number): boolean {
  const ownership = mockJourneyOwnership[userId as keyof typeof mockJourneyOwnership]
  if (!ownership) return false

  const journeyOwnership = ownership[journeyId as keyof typeof ownership]
  if (!journeyOwnership) return false

  if (journeyOwnership.expiresAt && journeyOwnership.expiresAt < Date.now()) {
    return false
  }

  return journeyOwnership.owned
}

/**
 * Export alias for compatibility with JourneyContext
 */
export const journeys = mockJourneys
