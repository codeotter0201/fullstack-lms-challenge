/**
 * 課程列表頁
 *
 * 符合目標網站設計：使用 FeaturedCourses 組件顯示課程卡片
 */

'use client'

import { useEffect } from 'react'
import { MainLayout } from '@/components/layout'
import { FeaturedCourses } from '@/components/home'
import { OrderHistory } from '@/components/order'
import { useJourney } from '@/contexts'

export default function CoursesPage() {
  const { journeys, loadJourneys, ownedJourneys } = useJourney()

  useEffect(() => {
    loadJourneys()
  }, [loadJourneys])

  // 轉換課程資料為精選課程格式
  const featuredCourses = journeys.map((journey) => ({
    id: journey.id,
    slug: journey.slug,
    name: journey.name || journey.title || '未命名課程',
    description: journey.description || '暫無描述',
    imageUrl: journey.imageUrl || journey.thumbnailUrl, // 優先使用 imageUrl，否則使用 thumbnailUrl
    instructor: '水球潘',
    studentCount: 1250,
    rating: 4.8,
    price: journey.price || 3980,
    discountedPrice: journey.price ? journey.price - 500 : 3480,
    isPremium: journey.isPremium,
    isOwned: ownedJourneys?.some((owned) => owned.id === journey.id) || false,
  }))

  // Mock 訂單記錄 (實際應從 API 獲取)
  const mockOrders = []

  return (
    <MainLayout>
      {/* 課程卡片區 */}
      <div className="px-6 py-8">
        <FeaturedCourses courses={featuredCourses} />
      </div>

      {/* 訂單記錄區 */}
      <div className="px-6 pb-8">
        <OrderHistory orders={mockOrders} />
      </div>
    </MainLayout>
  )
}
