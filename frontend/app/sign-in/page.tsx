/**
 * 登入/註冊頁面
 *
 * R2: 真實 API 串接
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Logo } from '@/components/layout'
import { Button, Card, Input, Tabs } from '@/components/ui'
import { useAuth, useToast } from '@/contexts'
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const { login, register, isAuthenticated, isLoading } = useAuth()
  const { success, error: showError } = useToast()

  // 表單狀態
  const [activeTab, setActiveTab] = useState('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    displayName: '',
  })

  // 如果已登入，重導向到首頁
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // 驗證 Email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setErrors(prev => ({ ...prev, email: '請輸入電子郵件' }))
      return false
    }
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: '請輸入有效的電子郵件格式' }))
      return false
    }
    setErrors(prev => ({ ...prev, email: '' }))
    return true
  }

  // 驗證密碼
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: '請輸入密碼' }))
      return false
    }
    if (password.length < 4) {
      setErrors(prev => ({ ...prev, password: '密碼至少需要 4 個字元' }))
      return false
    }
    setErrors(prev => ({ ...prev, password: '' }))
    return true
  }

  // 驗證顯示名稱
  const validateDisplayName = (displayName: string): boolean => {
    if (!displayName) {
      setErrors(prev => ({ ...prev, displayName: '請輸入顯示名稱' }))
      return false
    }
    if (displayName.length < 2 || displayName.length > 50) {
      setErrors(prev => ({ ...prev, displayName: '顯示名稱需為 2-50 字元' }))
      return false
    }
    setErrors(prev => ({ ...prev, displayName: '' }))
    return true
  }

  // 處理登入
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證
    const isEmailValid = validateEmail(formData.email)
    const isPasswordValid = validatePassword(formData.password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    try {
      await login(formData.email, formData.password)
      success('登入成功！')
      router.push('/')
    } catch (err: any) {
      showError(err.message || '登入失敗，請檢查您的電子郵件和密碼')
    }
  }

  // 處理註冊
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證
    const isEmailValid = validateEmail(formData.email)
    const isPasswordValid = validatePassword(formData.password)
    const isDisplayNameValid = validateDisplayName(formData.displayName)

    if (!isEmailValid || !isPasswordValid || !isDisplayNameValid) {
      return
    }

    try {
      await register(formData.email, formData.password, formData.displayName)
      success('註冊成功！歡迎加入 Waterball 學院')
      router.push('/')
    } catch (err: any) {
      const errorMsg = err.message || '註冊失敗，請稍後再試'
      if (errorMsg.includes('already exists') || errorMsg.includes('已存在')) {
        showError('此電子郵件已被註冊，請直接登入')
      } else {
        showError(errorMsg)
      }
    }
  }

  // 更新表單資料
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除該欄位的錯誤
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  if (isAuthenticated) {
    return null
  }

  // 登入表單
  const LoginForm = (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="email"
        placeholder="user@example.com"
        value={formData.email}
        onChange={(value) => updateFormData('email', value)}
        error={errors.email}
        icon={<Mail className="w-5 h-5" />}
        fullWidth
        autoComplete="email"
      />

      <Input
        type="password"
        placeholder="密碼（至少 4 碼）"
        value={formData.password}
        onChange={(value) => updateFormData('password', value)}
        error={errors.password}
        icon={<Lock className="w-5 h-5" />}
        fullWidth
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        icon={<LogIn className="w-5 h-5" />}
      >
        登入
      </Button>
    </form>
  )

  // 註冊表單
  const RegisterForm = (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        type="email"
        placeholder="user@example.com"
        value={formData.email}
        onChange={(value) => updateFormData('email', value)}
        error={errors.email}
        icon={<Mail className="w-5 h-5" />}
        fullWidth
        autoComplete="email"
      />

      <Input
        type="password"
        placeholder="密碼（至少 4 碼）"
        value={formData.password}
        onChange={(value) => updateFormData('password', value)}
        error={errors.password}
        icon={<Lock className="w-5 h-5" />}
        fullWidth
        autoComplete="new-password"
      />

      <Input
        type="text"
        placeholder="顯示名稱（2-50 字元）"
        value={formData.displayName}
        onChange={(value) => updateFormData('displayName', value)}
        error={errors.displayName}
        icon={<User className="w-5 h-5" />}
        fullWidth
        autoComplete="name"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        icon={<UserPlus className="w-5 h-5" />}
      >
        註冊
      </Button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary flex items-center justify-center p-4">
      <Container className="max-w-md">
        <Card className="p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)] bg-card border border-card-border">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text mb-3">
              歡迎來到 Waterball 學院
            </h1>
            <p className="text-text-secondary text-base">
              開始你的學習之旅
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            items={[
              {
                key: 'login',
                label: '登入',
                content: LoginForm,
              },
              {
                key: 'register',
                label: '註冊',
                content: RegisterForm,
              },
            ]}
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            centered
            className="mb-6"
          />

          {/* Info */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            <p>登入即表示您同意我們的</p>
            <p>
              <a href="#" className="text-primary hover:underline">
                服務條款
              </a>
              {' 與 '}
              <a href="#" className="text-primary hover:underline">
                隱私政策
              </a>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center text-text">
          <p className="text-sm text-text-secondary mb-4">為什麼選擇 Waterball 學院？</p>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <div className="text-2xl font-bold mb-1 text-primary">1000+</div>
              <div className="text-text-secondary">活躍學員</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1 text-primary">50+</div>
              <div className="text-text-secondary">專業課程</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1 text-primary">95%</div>
              <div className="text-text-secondary">滿意度</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
