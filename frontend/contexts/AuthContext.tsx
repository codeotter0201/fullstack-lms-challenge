/**
 * AuthContext 認證上下文
 *
 * 管理用戶認證狀態、登入/登出功能
 * R2: 串接真實後端 API
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, Occupation } from '@/types/user'
import * as authApi from '@/lib/api/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * 將後端 UserDTO 轉換為前端 User 型別
 */
function mapBackendUserToFrontend(backendUser: any): User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.displayName || backendUser.email.split('@')[0],
    nickname: backendUser.displayName,
    occupation: Occupation.PROGRAMMER, // 後端暫無此欄位，使用預設值
    level: backendUser.level || 1,
    exp: backendUser.experience || 0,
    nextLevelExp: (backendUser.level || 1) * 1000, // 每級需要 1000 EXP
    pictureUrl: backendUser.avatarUrl || '/blog/avatar.webp',
    roles: backendUser.isPremium ? [UserRole.STUDENT_PAID] : [UserRole.STUDENT_FREE],
    primaryRole: backendUser.isPremium ? UserRole.STUDENT_PAID : UserRole.STUDENT_FREE,
    birthday: undefined,
    gender: undefined,
    region: undefined,
    githubLink: undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初始化：從 localStorage 載入用戶狀態
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken) {
          // 嘗試使用 token 取得用戶資訊
          try {
            const response = await authApi.getCurrentUser()
            if (response.success && response.data) {
              const mappedUser = mapBackendUserToFrontend(response.data)
              setUser(mappedUser)
            } else {
              // Token 無效，清除
              localStorage.removeItem('accessToken')
            }
          } catch (err) {
            // Token 過期或無效
            localStorage.removeItem('accessToken')
            console.error('Failed to get current user:', err)
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * 登入功能
   * 使用 email + password 登入
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login(email, password)

      if (response.success && response.data) {
        const { user: backendUser, accessToken } = response.data

        // 轉換用戶資料
        const mappedUser = mapBackendUserToFrontend(backendUser)
        setUser(mappedUser)

        // 儲存 JWT token
        localStorage.setItem('accessToken', accessToken)
      } else {
        throw new Error(response.error?.message || '登入失敗')
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '登入失敗，請檢查您的電子郵件和密碼'
      setError(errorMessage)
      console.error('Login failed:', error)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 註冊功能
   * 建立新帳號
   */
  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.register(email, password, displayName)

      if (response.success && response.data) {
        const { user: backendUser, accessToken } = response.data

        // 轉換用戶資料
        const mappedUser = mapBackendUserToFrontend(backendUser)
        setUser(mappedUser)

        // 儲存 JWT token
        localStorage.setItem('accessToken', accessToken)
      } else {
        throw new Error(response.error?.message || '註冊失敗')
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || '註冊失敗，請稍後再試'
      setError(errorMessage)
      console.error('Register failed:', error)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 登出功能
   */
  const logout = async () => {
    setIsLoading(true)
    try {
      await authApi.logout()

      // 清除狀態
      setUser(null)
      setError(null)
      localStorage.removeItem('accessToken')
    } catch (error) {
      console.error('Logout failed:', error)
      // 即使 API 失敗也要清除本地狀態
      setUser(null)
      localStorage.removeItem('accessToken')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 更新用戶資料
   */
  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    setUser(prev => prev ? { ...prev, ...updates } : null)
    // R3 TODO: 同步更新到後端
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 * 用於在元件中存取認證狀態
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
