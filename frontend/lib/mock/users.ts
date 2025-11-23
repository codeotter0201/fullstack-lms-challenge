/**
 * Mock 用戶資料
 *
 * 提供測試用的用戶資料，包含不同角色與等級的用戶
 */

import { User, UserRole, Occupation, AccountBindings } from '@/types/user'

/**
 * 當前登入用戶 (可切換)
 */
export let currentUser: User = {
  id: 1,
  email: 'john.doe@example.com',
  name: 'John Doe',
  nickname: '小明',
  occupation: Occupation.PROGRAMMER,
  level: 12,
  exp: 6500,
  nextLevelExp: 2000,
  pictureUrl: '/blog/avatar.webp',
  roles: [UserRole.STUDENT_FREE],
  primaryRole: UserRole.STUDENT_FREE,

  birthday: '1995-06-15',
  gender: '男',
  region: '台灣',
  githubLink: 'https://github.com/johndoe',
}

/**
 * 切換當前用戶
 */
export function setCurrentUser(user: User) {
  currentUser = user
}

/**
 * Mock 用戶列表
 */
export const mockUsers: User[] = [
  // 免費學員
  {
    id: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    nickname: '小明',
    occupation: Occupation.PROGRAMMER,
    level: 12,
    exp: 6500,
    nextLevelExp: 2000,
    pictureUrl: '/blog/avatar.webp',
    roles: [UserRole.STUDENT_FREE],
    primaryRole: UserRole.STUDENT_FREE,
    birthday: '1995-06-15',
    gender: '男',
    region: '台灣',
    githubLink: 'https://github.com/johndoe',
  },

  // 付費學員
  {
    id: 2,
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    nickname: '小美',
    occupation: Occupation.SENIOR_PROGRAMMER,
    level: 28,
    exp: 42000,
    nextLevelExp: 2000,
    pictureUrl: 'https://lh3.googleusercontent.com/a/default-user-2',
    roles: [UserRole.STUDENT_PAID],
    primaryRole: UserRole.STUDENT_PAID,
    birthday: '1992-03-20',
    gender: '女',
    region: '台灣',
    githubLink: 'https://github.com/janesmith',
  },

  // 老師
  {
    id: 3,
    email: 'teacher@waterballsa.tw',
    name: '水球潘',
    nickname: '水球',
    occupation: Occupation.ARCHITECT,
    level: 36,
    exp: 65000,
    nextLevelExp: 0,
    pictureUrl: 'https://lh3.googleusercontent.com/a/teacher-avatar',
    roles: [UserRole.TEACHER, UserRole.STUDENT_PAID],
    primaryRole: UserRole.TEACHER,
    birthday: '1988-08-08',
    gender: '男',
    region: '台灣',
    githubLink: 'https://github.com/waterballpan',
  },

  // 管理員
  {
    id: 4,
    email: 'admin@waterballsa.tw',
    name: 'Admin User',
    nickname: '管理員',
    occupation: Occupation.TECH_LEAD,
    level: 35,
    exp: 63000,
    nextLevelExp: 2000,
    pictureUrl: 'https://lh3.googleusercontent.com/a/admin-avatar',
    roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT_PAID],
    primaryRole: UserRole.ADMIN,
  },

  // 初級工程師 (免費)
  {
    id: 5,
    email: 'beginner@example.com',
    name: 'Beginner Lee',
    nickname: '新手李',
    occupation: Occupation.JUNIOR_PROGRAMMER,
    level: 3,
    exp: 800,
    nextLevelExp: 1000,
    pictureUrl: 'https://lh3.googleusercontent.com/a/beginner-avatar',
    roles: [UserRole.STUDENT_FREE],
    primaryRole: UserRole.STUDENT_FREE,
  },

  // 技術主管 (付費)
  {
    id: 6,
    email: 'techlead@example.com',
    name: 'Tech Lead Chen',
    nickname: '主管陳',
    occupation: Occupation.TECH_LEAD,
    level: 32,
    exp: 57000,
    nextLevelExp: 2000,
    pictureUrl: 'https://lh3.googleusercontent.com/a/techlead-avatar',
    roles: [UserRole.STUDENT_PAID],
    primaryRole: UserRole.STUDENT_PAID,
    githubLink: 'https://github.com/techleadchen',
  },
]

/**
 * 根據 ID 獲取用戶
 */
export function getUserById(id: number): User | undefined {
  return mockUsers.find(user => user.id === id)
}

/**
 * 根據角色獲取用戶列表
 */
export function getUsersByRole(role: UserRole): User[] {
  return mockUsers.filter(user => user.roles.includes(role))
}

/**
 * Mock 帳號綁定狀態
 */
export const mockAccountBindings: Record<number, AccountBindings> = {
  1: {
    discord: false,
    github: true,
  },
  2: {
    discord: true,
    github: true,
  },
  3: {
    discord: true,
    github: true,
  },
  4: {
    discord: true,
    github: true,
  },
  5: {
    discord: false,
    github: false,
  },
  6: {
    discord: true,
    github: true,
  },
}

/**
 * 獲取帳號綁定狀態
 */
export function getAccountBindings(userId: number): AccountBindings {
  return mockAccountBindings[userId] || {
    discord: false,
    github: false,
  }
}

/**
 * Mock 用戶統計資料
 */
export const mockUserStats = {
  1: {
    totalExp: 6500,
    level: 12,
    lessonsCompleted: 45,
    gymsPassed: 3,
    badgesEarned: 8,
    journeysEnrolled: 2,
    studyDays: 28,
    totalStudyTime: 840, // 14 hours
  },
  2: {
    totalExp: 42000,
    level: 28,
    lessonsCompleted: 180,
    gymsPassed: 15,
    badgesEarned: 32,
    journeysEnrolled: 5,
    studyDays: 120,
    totalStudyTime: 3600, // 60 hours
  },
  3: {
    totalExp: 65000,
    level: 36,
    lessonsCompleted: 250,
    gymsPassed: 25,
    badgesEarned: 50,
    journeysEnrolled: 8,
    studyDays: 200,
    totalStudyTime: 6000, // 100 hours
  },
  4: {
    totalExp: 63000,
    level: 35,
    lessonsCompleted: 240,
    gymsPassed: 24,
    badgesEarned: 48,
    journeysEnrolled: 8,
    studyDays: 180,
    totalStudyTime: 5400, // 90 hours
  },
  5: {
    totalExp: 800,
    level: 3,
    lessonsCompleted: 8,
    gymsPassed: 0,
    badgesEarned: 2,
    journeysEnrolled: 1,
    studyDays: 5,
    totalStudyTime: 150, // 2.5 hours
  },
  6: {
    totalExp: 57000,
    level: 32,
    lessonsCompleted: 220,
    gymsPassed: 20,
    badgesEarned: 45,
    journeysEnrolled: 6,
    studyDays: 150,
    totalStudyTime: 4800, // 80 hours
  },
}

/**
 * 獲取用戶統計資料
 */
export function getUserStats(userId: number) {
  return mockUserStats[userId as keyof typeof mockUserStats] || {
    totalExp: 0,
    level: 1,
    lessonsCompleted: 0,
    gymsPassed: 0,
    badgesEarned: 0,
    journeysEnrolled: 0,
    studyDays: 0,
    totalStudyTime: 0,
  }
}
