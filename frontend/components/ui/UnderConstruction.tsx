/**
 * UnderConstruction 建置中頁面元件
 * 用於顯示尚未實作的功能頁面
 */

import Link from 'next/link'
import { Construction, ArrowLeft, Home, BookOpen } from 'lucide-react'

interface UnderConstructionProps {
  title?: string
  description?: string
  showBackButton?: boolean
  backUrl?: string
  backLabel?: string
}

export default function UnderConstruction({
  title = '功能建置中',
  description = '此功能正在開發中，敬請期待！我們會盡快為您帶來更好的學習體驗。',
  showBackButton = true,
  backUrl = '/courses',
  backLabel = '返回課程',
}: UnderConstructionProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 建置中圖示 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary opacity-20 blur-3xl rounded-full"></div>
            <Construction className="w-24 h-24 md:w-32 md:h-32 text-primary relative animate-pulse" />
          </div>
        </div>

        {/* 主標題 */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>

        {/* 副標題 */}
        <p className="text-lg md:text-xl text-secondary mb-12 max-w-xl mx-auto">
          {description}
        </p>

        {/* 導航按鈕 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showBackButton && (
            <Link
              href={backUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark-card text-white font-semibold rounded-lg hover:bg-dark-hover border border-dark-border transition-colors duration-200 w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              {backLabel}
            </Link>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark-navy font-semibold rounded-lg hover:bg-primary-hover transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            返回首頁
          </Link>
        </div>

        {/* 建議連結 */}
        <div className="mt-16 pt-8 border-t border-dark-border">
          <p className="text-sm text-secondary mb-4">同時您也可以探索：</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              課程列表
            </Link>
            <span className="text-secondary">·</span>
            <Link
              href="/leaderboard"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              排行榜
            </Link>
            <span className="text-secondary">·</span>
            <Link
              href="/users/me/profile"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              個人檔案
            </Link>
            <span className="text-secondary">·</span>
            <Link
              href="/users/me/portfolio"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              挑戰歷程
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
