/**
 * 首頁
 *
 * 完全符合目標網站設計：https://world.waterballsa.tw/
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MainLayout, Container } from '@/components/layout'
import { Button } from '@/components/ui'
import { PromotionalBanner } from '@/components/promotional'
import { useJourney, useAuth } from '@/contexts'
import { BookOpen, Newspaper, Users, Star, ArrowRight, CircleCheck, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { journeys, loadJourneys } = useJourney()
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0)

  useEffect(() => {
    loadJourneys()
  }, [loadJourneys])

  // 課程資料
  const courseImages = [
    '/world/courses/course_0.png',
    '/world/courses/course_4.png'
  ]

  const courses = journeys.slice(0, 2).map((journey, index) => ({
    id: journey.id,
    slug: journey.slug,
    name: journey.name,
    description: journey.description,
    imageUrl: courseImages[index] || '/images/course-placeholder.png',
    instructor: '水球潘',
    isSelected: index === selectedCourseIndex,
    promotionalText: index === 0
      ? '看完課程介紹，立刻折價 3,000 元'
      : null,
    ctaText: index === 0 ? '立刻體驗' : '立刻購買',
    ctaVariant: index === 0 ? 'outline' : 'primary',
  }))

  return (
    <MainLayout>
      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Main Container */}
      <div className="container mx-auto p-4 lg:p-6">
        {/* Welcome Section with Border Top */}
        <section className="mb-8 bg-card rounded-lg shadow-md p-4 lg:p-8 border-t-8 border-primary">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            歡迎來到水球軟體學院
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6">
            水球軟體學院提供最先進的軟體設計思路教材，並透過線上 Code Review 來帶你掌握進階軟體架構能力。{' '}
            <br className="hidden md:block" />
            只要每週投資 5 小時，就能打造不平等的優勢，成為硬核的 Coding 實戰高手。
          </p>

          {/* Course Cards Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {courses.map((course, index) => (
              <div
                key={course.id}
                role="button"
                tabIndex={0}
                aria-label={course.name}
                aria-pressed={course.isSelected}
                onClick={() => setSelectedCourseIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedCourseIndex(index)
                  }
                }}
                className={cn(
                  'rounded-lg border bg-card text-card-foreground shadow-sm',
                  'relative overflow-hidden cursor-pointer select-none',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  'flex flex-col h-full',
                  course.isSelected && 'border-primary selected'
                )}
              >
                {/* Course Image */}
                <div className="relative w-full h-40 bg-muted flex-shrink-0">
                  <Image
                    src={course.imageUrl}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Course Content */}
                <div className="space-y-2 p-4 flex-grow">
                  <h3 className="text-base font-semibold leading-tight">
                    {course.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="flex-shrink-0">
                      <div className="text-base font-bold text-yellow-400">
                        {course.instructor}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>

                {/* CTA Section */}
                <div className="flex items-center p-4 pt-0 flex-shrink-0 mt-auto">
                  <div className="w-full space-y-3">
                    {course.promotionalText && (
                      <p className="text-sm text-yellow-400 text-center">
                        {course.promotionalText}
                      </p>
                    )}
                    <Link href={`/journeys/${course.slug}`}>
                      <Button
                        variant={course.ctaVariant as 'primary' | 'outline'}
                        className="w-full"
                      >
                        {course.ctaText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Cards Section - 2x2 Grid */}
        <section className="mb-8">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Card 1: 軟體設計模式之旅課程 */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight flex items-center text-lg md:text-xl">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  軟體設計模式之旅課程
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="mb-3 text-sm md:text-base">
                  「用一趟旅程的時間，成為硬核的 Coding 高手」 — 精通一套高效率的 OOAD 思路。
                </p>
                <Link href="/journeys/software-design-pattern">
                  <Button variant="primary" className="w-full sm:w-auto">
                    查看課程
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: 水球潘的部落格 */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight flex items-center text-lg md:text-xl">
                  <Newspaper className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  水球潘的部落格
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="mb-3 text-sm md:text-base">
                  觀看水球撰寫的軟體工程師職涯、軟體設計模式及架構學問，以及領域驅動設計等公開文章。
                </p>
                <a
                  href="https://blog.waterballsa.tw"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" className="w-full sm:w-auto">
                    閱讀文章
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Card 3: 直接與老師或其他工程師交流 */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight flex items-center text-lg md:text-xl">
                  <Users className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  直接與老師或是其他工程師交流
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="mb-3 text-sm md:text-base">
                  加入水球成立的工程師 Discord 社群，與水球以及其他工程師線上交流，培養學習習慣及樂趣。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.facebook.com/groups/waterballsa.tw"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" className="w-full sm:w-auto">
                      加入 Facebook 社團
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <a
                    href="https://waterballsa.pse.is/wsagent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-primary text-primary font-medium hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
                    >
                      加入 Discord
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Card 4: 技能評級及證書系統 */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight flex items-center text-lg md:text-xl">
                  <Star className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  技能評級及證書系統
                </h3>
              </div>
              <div className="p-6 pt-0">
                <p className="mb-3 text-sm md:text-base">
                  通過技能評級、獲取證書，打造你的職涯籌碼，讓你在就業市場上脫穎而出。
                </p>
                <Link href="/skills-intro">
                  <Button variant="primary" className="w-full sm:w-auto">
                    了解更多
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Profile Section */}
        <section className="mb-8">
          <div className="bg-card rounded-lg shadow-md p-4 lg:p-8">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-12 items-center">
              {/* Founder Avatar */}
              <div className="w-32 h-32 md:w-48 md:h-48 relative rounded-full overflow-hidden shrink-0">
                <Image
                  src="/blog/avatar.webp"
                  alt="水球潘 創辦人照片"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Founder Info */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-center md:text-left">
                  水球潘
                </h3>
                <p className="text-sm md:text-base text-gray-300 mb-4">
                  七年程式教育者 & 軟體設計學講師，致力於將複雜的軟體設計概念轉化為易於理解和實踐的教學內容。
                </p>

                {/* Achievements List */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-start gap-2 text-sm md:text-base text-gray-300">
                    <CircleCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>
                      主修 Christopher Alexander 設計模式、軟體架構、分散式系統架構、Clean Architecture、領域驅動設計等領域
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm md:text-base text-gray-300">
                    <CircleCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>過去 40 多場 Talk 平均 93 位觀眾參與</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm md:text-base text-gray-300">
                    <CircleCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>主辦的學院社群一年內成長超過 6000 位成員</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm md:text-base text-gray-300">
                    <CircleCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>
                      帶領軟體工程方法論學習組織「GaaS」超過 200 多位成員，引領 30 組自組織團隊
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm md:text-base text-gray-300">
                    <CircleCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <span>領域驅動設計社群核心志工 & 講師</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Homepage Footer Section */}
      <footer className="bg-[#2D3142] border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center gap-8">
            {/* Logo */}
            <Link href="/" className="transition-opacity hover:opacity-80">
              <div className="relative w-40 h-10 md:w-48 md:h-12">
                <Image
                  src="/world/logo.png"
                  fill
                  className="object-contain"
                  alt="Waterball 學院"
                />
              </div>
            </Link>

            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} 水球球特務有限公司
            </p>

            {/* Legal Links + Email */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <Link
                href="/terms/privacy"
                className="text-gray-300 hover:text-primary transition-all hover:underline underline-offset-4"
              >
                隱私權政策
              </Link>
              <span className="hidden sm:inline text-gray-600">|</span>
              <Link
                href="/terms/service"
                className="text-gray-300 hover:text-primary transition-all hover:underline underline-offset-4"
              >
                服務條款
              </Link>
              <span className="hidden sm:inline text-gray-600">|</span>
              <a
                href="mailto:support@waterballsa.tw"
                className="text-gray-300 hover:text-primary transition-all hover:underline underline-offset-4 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                support@waterballsa.tw
              </a>
            </div>
          </div>
        </div>
      </footer>
    </MainLayout>
  )
}
