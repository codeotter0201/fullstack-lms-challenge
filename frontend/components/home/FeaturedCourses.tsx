/**
 * FeaturedCourses 精選課程展示
 *
 * 顯示精選的課程卡片，橫向佈局，金色邊框設計
 * 符合目標網站設計：https://world.waterballsa.tw/
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useJourney } from '@/contexts'

interface FeaturedCourse {
  id: number
  slug: string
  name: string
  description: string
  imageUrl?: string
  instructor: string
  studentCount: number
  rating: number
  price: number
  discountedPrice?: number
  isPremium?: boolean
  isOwned?: boolean
  promotionalText?: string
}

interface FeaturedCoursesProps {
  courses?: FeaturedCourse[]
  className?: string
}

export default function FeaturedCourses({
  courses = [],
  className,
}: FeaturedCoursesProps) {
  const { journeys, setSelectedJourney } = useJourney()

  // 點擊課程卡片時更新 selectedJourney
  const handleCourseClick = (courseSlug: string) => {
    const journey = journeys.find(j => j.slug === courseSlug || String(j.id) === courseSlug)
    if (journey) {
      setSelectedJourney(journey)
    }
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* 移除標題區塊，直接顯示課程卡片 */}
      {/* <div className="text-center space-y-2">
        <p className="text-text-secondary text-sm">
          精選課程，帶你從入門到精通
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
          熱門課程
        </h2>
      </div> */}

      {/* 課程卡片 - 網格佈局，每列最多3個 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {courses.map((course) => {
          const hasDiscount = course.discountedPrice && course.discountedPrice < course.price
          const isPremium = course.isPremium ?? true
          const isOwned = course.isOwned ?? false
          const defaultPromo = hasDiscount
            ? `看完課程介紹，立刻折價 ${course.price - course.discountedPrice!} 元`
            : '看完課程介紹，立刻折價 500 元'

          return (
            <Link
              key={course.id}
              href={`/journeys/${course.slug}`}
              onClick={() => handleCourseClick(course.slug)}
              className={cn(
                'border-2 border-primary rounded-md overflow-hidden',
                'bg-background-secondary',
                'hover:shadow-2xl hover:shadow-primary/20',
                'hover:scale-105',
                'transition-all duration-300 ease-in-out cursor-pointer',
                'flex flex-col'
              )}
            >
              {/* 課程封面圖 - 上方 */}
              <div className="relative w-full aspect-video border-t-4 border-primary">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary/30">
                      {course.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* 課程內容 - 下方 */}
              <div className="flex-1 flex flex-col p-6">
                {/* 課程標題 */}
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {course.name}
                </h3>

                {/* 講師名稱 - 金色 */}
                <p className="text-primary text-base font-semibold mb-3">
                  {course.instructor}
                </p>

                {/* 課程描述 */}
                <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
                  {course.description}
                </p>

                {/* 底部：促銷訊息 + CTA 按鈕 */}
                <div className="flex flex-col gap-3 mt-auto">
                  {/* 促銷訊息區塊 - 金色背景 */}
                  <div className="bg-primary text-[rgb(23,25,35)] px-4 py-3 rounded-md text-sm font-medium text-center">
                    {course.promotionalText || defaultPromo}
                  </div>

                  {/* CTA 按鈕 */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {isOwned ? '立刻體驗' : isPremium ? '立刻購買' : '立刻體驗'}
                  </Button>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
