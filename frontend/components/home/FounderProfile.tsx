/**
 * FounderProfile 創辦人介紹
 *
 * 顯示創辦人的照片、姓名、職稱與簡介
 */

'use client'

import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FounderProfileProps {
  name?: string
  title?: string
  bio?: string
  imageUrl?: string
  className?: string
}

export default function FounderProfile({
  name = '水球潘',
  title = '水球軟體學院創辦人 & 資深架構師',
  bio = '10 年以上軟體開發經驗，曾任職於多家科技公司擔任技術架構師。深信「教育能改變人生」，致力於打造最適合華人學習的軟體教育平台。透過獨創的遊戲化學習系統，已協助超過 10,000 名學員成功轉職或升遷。',
  imageUrl,
  className,
}: FounderProfileProps) {
  return (
    <div className={cn('relative', className)}>
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />

      <div className="relative bg-background-tertiary border border-border rounded-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* 創辦人照片 */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-primary/20">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {/* 引號裝飾 */}
            <div className="absolute -top-2 -left-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-black" fill="currentColor" />
            </div>
          </div>

          {/* 創辦人資訊 */}
          <div className="flex-1 text-center md:text-left space-y-4">
            {/* 姓名與職稱 */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                {name}
              </h2>
              <p className="text-base md:text-lg text-primary font-medium">
                {title}
              </p>
            </div>

            {/* 分隔線 */}
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-transparent mx-auto md:mx-0" />

            {/* 簡介 */}
            <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
              {bio}
            </p>

            {/* 特色標籤 */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {['15 年軟體經驗', '10,000+ 學員', 'Clean Code 專家', 'AWS 認證架構師'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-background-secondary border border-border text-sm text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
