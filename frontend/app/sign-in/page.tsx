/**
 * 登入頁面
 *
 * LINE Login 登入
 * R1: Mock 登入
 * R2: 整合真實 LINE Login
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Section, Logo } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { useAuth, useToast } from '@/contexts'
import { LogIn } from 'lucide-react'
import Image from 'next/image'

export default function SignInPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuth()
  const { success, error } = useToast()

  // 如果已登入，重導向到首頁
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleLineLogin = async () => {
    try {
      // R1: Mock 登入
      await login()
      success('登入成功！')
      router.push('/')

      // R2 TODO: LINE Login
      // 1. 導向 LINE Login 授權頁面
      // const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?...`
      // window.location.href = lineLoginUrl
      //
      // 2. LINE 會 redirect 回來，帶著 code
      // 3. 用 code 交換 access_token
      // 4. 呼叫後端 API 登入
    } catch (err) {
      console.error('Login failed:', err)
      error('登入失敗，請稍後再試')
    }
  }

  // R1: 顯示 Mock 登入提示
  const handleDemoLogin = async () => {
    try {
      await login('mock-line-token')
      success('以測試帳號登入成功！')
      router.push('/')
    } catch (err) {
      error('登入失敗，請稍後再試')
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <Container className="max-w-md">
        <Card className="p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              歡迎來到 Waterball 學院
            </h1>
            <p className="text-gray-600">
              使用 LINE 帳號登入，開始你的學習之旅
            </p>
          </div>

          {/* LINE Login Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleLineLogin}
            loading={isLoading}
            icon={<LogIn className="w-5 h-5" />}
            className="mb-4 bg-[#06C755] hover:bg-[#05B34C] text-white"
          >
            使用 LINE 登入
          </Button>

          {/* R1: Demo Login */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Release 1 測試模式
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleDemoLogin}
            loading={isLoading}
          >
            使用測試帳號登入
          </Button>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>登入即表示您同意我們的</p>
            <p>
              <a href="#" className="text-primary-600 hover:underline">
                服務條款
              </a>
              {' 與 '}
              <a href="#" className="text-primary-600 hover:underline">
                隱私政策
              </a>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center text-white">
          <p className="text-sm opacity-90 mb-4">為什麼選擇 Waterball 學院？</p>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-2xl font-bold mb-1">1000+</div>
              <div className="opacity-80">活躍學員</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">50+</div>
              <div className="opacity-80">專業課程</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">95%</div>
              <div className="opacity-80">滿意度</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
