/**
 * AuthContext 認證上下文
 *
 * 管理用戶認證狀態、登入/登出功能
 * R1: 使用 Mock 資料模擬
 * R2: 整合真實 LINE Login API
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/user'
import { currentUser } from '@/lib/mock/users'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (lineToken?: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化：從 localStorage 載入用戶狀態
  useEffect(() => {
    const initAuth = async () => {
      try {
        // R1: 從 localStorage 檢查是否有保存的登入狀態
        const savedUserId = localStorage.getItem('userId')

        if (savedUserId) {
          // R1: 使用 Mock 用戶
          setUser(currentUser)
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
   * R1: 使用 Mock 資料
   * R2: 整合 LINE Login API
   */
  const login = async (lineToken?: string) => {
    setIsLoading(true)
    try {
      // R1: Mock 登入邏輯
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 500))

      // 使用 Mock 用戶
      setUser(currentUser)

      // 保存到 localStorage
      localStorage.setItem('userId', currentUser.id.toString())

      // R2 TODO: 整合真實 LINE Login
      // const response = await fetch('/api/auth/line', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: lineToken }),
      // })
      // const data = await response.json()
      // setUser(data.user)
      // localStorage.setItem('accessToken', data.accessToken)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
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
      // R1: Mock 登出邏輯
      await new Promise(resolve => setTimeout(resolve, 300))

      // 清除狀態
      setUser(null)
      localStorage.removeItem('userId')

      // R2 TODO: 呼叫登出 API
      // await fetch('/api/auth/logout', { method: 'POST' })
      // localStorage.removeItem('accessToken')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
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

    // R2 TODO: 同步更新到後端
    // await fetch('/api/users/me', {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates),
    // })
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
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
