/**
 * 全域 404 頁面
 * 當使用者訪問不存在的路由時顯示
 * 使用 MainLayout 以保持一致的導航體驗
 */

import Link from 'next/link'
import { Home, BookOpen } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-200px)]">
        <div className="max-w-2xl w-full text-center">
          {/* 404 大數字 */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[200px] font-bold text-primary leading-none">
              404
            </h1>
          </div>

          {/* 主標題 */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            頁面不存在
          </h2>

          {/* 副標題 */}
          <p className="text-lg md:text-xl text-secondary mb-12">
            抱歉，您訪問的頁面不存在或已被移除。
            <br className="hidden md:block" />
            請檢查網址是否正確，或返回首頁繼續探索。
          </p>

          {/* 導航按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-dark-navy font-semibold rounded-lg hover:bg-primary-hover transition-colors duration-200 w-full sm:w-auto justify-center"
            >
              <Home className="w-5 h-5" />
              返回首頁
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark-card text-white font-semibold rounded-lg hover:bg-dark-hover border border-dark-border transition-colors duration-200 w-full sm:w-auto justify-center"
            >
              <BookOpen className="w-5 h-5" />
              瀏覽課程
            </Link>
          </div>

          {/* 建議連結 */}
          <div className="mt-16 pt-8 border-t border-dark-border">
            <p className="text-sm text-secondary mb-4">您可能在尋找：</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/courses"
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
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
    </MainLayout>
  )
}
