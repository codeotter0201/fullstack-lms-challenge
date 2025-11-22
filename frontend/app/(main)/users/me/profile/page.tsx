/**
 * 個人檔案頁面
 *
 * 符合目標網站設計：
 * - 用戶頭像與名稱
 * - 標籤頁導航（基本資料、道館徽章、技能評級、證書）
 * - 基本資料卡片
 * - Discord/GitHub 綁定
 * - 訂單紀錄
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout'
import {
  UserProfileHeader,
  ProfileTabs,
  BasicInfoCard,
  DiscordBindingCard,
  GitHubBindingCard,
} from '@/components/user'
import { OrderHistory } from '@/components/order'
import { Spinner } from '@/components/ui'
import { useAuth } from '@/contexts'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/sign-in')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    )
  }

  // Mock 訂單記錄
  const mockOrders = [
    {
      id: '1',
      orderNumber: '20251121001055504f',
      courseName: 'AI x BDD：規格驅動全自動化開發術',
      courseImage: 'https://cdn.waterballsa.tw/courses/ai-bdd.jpg',
      amount: 7599,
      discount: 0,
      finalAmount: 7599,
      status: 'pending' as const,
      createdAt: new Date('2025-11-21'),
      dueDate: new Date('2025-11-24'),
    },
  ]

  // 渲染不同標籤頁的內容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* 基本資料卡片 */}
            <BasicInfoCard user={user} onEdit={() => console.log('Edit profile')} />

            {/* Discord 綁定 */}
            <DiscordBindingCard
              isBound={false}
              onBind={() => console.log('Bind Discord')}
            />

            {/* GitHub 綁定 + Repos */}
            <GitHubBindingCard
              isBound={false}
              onBind={() => console.log('Bind GitHub')}
            />

            {/* 訂單紀錄 */}
            <OrderHistory orders={mockOrders} />
          </div>
        )

      case 'badges':
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">道館徽章功能開發中...</p>
          </div>
        )

      case 'skills':
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">技能評級功能開發中...</p>
          </div>
        )

      case 'certificates':
        return (
          <div className="text-center py-12">
            <p className="text-gray-400">證書功能開發中...</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 用戶頭像與名稱 */}
        <UserProfileHeader user={user} />

        {/* 標籤頁導航 */}
        <ProfileTabs activeKey={activeTab} onChange={setActiveTab}>
          {renderTabContent()}
        </ProfileTabs>
      </div>
    </MainLayout>
  )
}
