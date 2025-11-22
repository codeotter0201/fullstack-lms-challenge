/**
 * 用戶相關型別定義
 *
 * 定義用戶、角色、權限等相關型別
 */

/**
 * 用戶角色
 */
export enum UserRole {
  STUDENT_FREE = 'STUDENT_FREE',     // 免費學員
  STUDENT_PAID = 'STUDENT_PAID',     // 付費學員
  TEACHER = 'TEACHER',               // 老師
  ADMIN = 'ADMIN',                   // 管理員
}

/**
 * 職業類型
 */
export enum Occupation {
  JUNIOR_PROGRAMMER = 'JUNIOR_PROGRAMMER',  // 初級工程師
  PROGRAMMER = 'PROGRAMMER',                // 工程師
  SENIOR_PROGRAMMER = 'SENIOR_PROGRAMMER',  // 資深工程師
  TECH_LEAD = 'TECH_LEAD',                  // 技術主管
  ARCHITECT = 'ARCHITECT',                  // 架構師
}

/**
 * 用戶資料
 */
export interface User {
  id: number
  email: string
  name: string
  nickname?: string
  occupation: Occupation
  level: number
  exp: number
  nextLevelExp: number
  pictureUrl: string
  roles: UserRole[]

  // 個人檔案額外欄位
  birthday?: string
  gender?: string
  region?: string
  githubLink?: string

  // R1 簡化：一個用戶只有一個主要角色
  primaryRole: UserRole
}

/**
 * 用戶權限
 */
export interface UserPermission {
  canAccessPaidContent: boolean
  canReviewSubmissions: boolean  // 老師權限
  canManageUsers: boolean         // 管理員權限
}

/**
 * 登入憑證
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * OAuth 提供者
 */
export type OAuthProvider = 'google' | 'facebook'

/**
 * 認證回應
 */
export interface AuthResponse {
  user: User
  token: string
}

/**
 * 認證狀態
 */
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

/**
 * 帳號綁定狀態
 */
export interface AccountBindings {
  discord: boolean
  github: boolean
}

/**
 * 等級對照表項目
 */
export interface LevelConfig {
  level: number
  totalExp: number        // 累積經驗值
  expToNextLevel: number  // 升級所需經驗值
}

/**
 * 等級計算工具
 */
export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, totalExp: 0, expToNextLevel: 200 },
  { level: 2, totalExp: 200, expToNextLevel: 300 },
  { level: 3, totalExp: 500, expToNextLevel: 1000 },
  { level: 4, totalExp: 1500, expToNextLevel: 1500 },
  { level: 5, totalExp: 3000, expToNextLevel: 2000 },
  // Level 6-35: 每級固定 2000 EXP
  ...Array.from({ length: 30 }, (_, i) => ({
    level: 6 + i,
    totalExp: 5000 + i * 2000,
    expToNextLevel: 2000,
  })),
  { level: 36, totalExp: 65000, expToNextLevel: 0 }, // 滿級
]

/**
 * 根據經驗值計算等級
 */
export function calculateLevel(exp: number): {
  level: number
  currentExp: number
  nextLevelExp: number
  progress: number
} {
  // 找到當前等級
  let currentLevel = 1
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_CONFIGS[i].totalExp) {
      currentLevel = LEVEL_CONFIGS[i].level
      break
    }
  }

  const levelConfig = LEVEL_CONFIGS.find(c => c.level === currentLevel)!
  const currentExp = exp - levelConfig.totalExp
  const nextLevelExp = levelConfig.expToNextLevel

  return {
    level: currentLevel,
    currentExp,
    nextLevelExp,
    progress: nextLevelExp > 0 ? (currentExp / nextLevelExp) * 100 : 100,
  }
}

/**
 * 職業中文名稱對照
 */
export const OCCUPATION_NAMES: Record<Occupation, string> = {
  [Occupation.JUNIOR_PROGRAMMER]: '初級工程師',
  [Occupation.PROGRAMMER]: '工程師',
  [Occupation.SENIOR_PROGRAMMER]: '資深工程師',
  [Occupation.TECH_LEAD]: '技術主管',
  [Occupation.ARCHITECT]: '架構師',
}

/**
 * 角色中文名稱對照
 */
export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.STUDENT_FREE]: '免費學員',
  [UserRole.STUDENT_PAID]: '付費學員',
  [UserRole.TEACHER]: '老師',
  [UserRole.ADMIN]: '管理員',
}
