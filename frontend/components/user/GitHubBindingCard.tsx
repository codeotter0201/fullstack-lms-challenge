/**
 * GitHubBindingCard Component
 *
 * GitHub 帳號綁定卡片 + 課程 GitHub Repos
 * - GitHub 圖標 + 綁定狀態
 * - 綁定按鈕（黃色邊框）
 * - 課程 Repos 列表
 */

'use client'

import { Card } from '@/components/ui'
import { AlertCircle, Github } from 'lucide-react'

export interface CourseRepo {
  name: string
  repoPath: string
  description: string
  isPurchased: boolean
}

export interface GitHubBindingCardProps {
  isBound?: boolean
  onBind?: () => void
  courseRepos?: CourseRepo[]
}

const defaultCourseRepos: CourseRepo[] = [
  {
    name: '水球軟體學院： AI x BDD：規格驅動全自動開發術',
    repoPath: 'Waterball-Software-Academy/AI-x-BDD-Spec-Driven-100-Automation',
    description: '購買「AI x BDD：規格驅動全自動開發術」課程即可加入',
    isPurchased: false,
  },
  {
    name: 'SDD.os：課程中用到的高精度測試翻譯技術',
    repoPath: 'SDD-TW/sdd.os',
    description: '購買「AI x BDD：規格驅動全自動開發術」課程即可加入',
    isPurchased: false,
  },
]

export function GitHubBindingCard({
  isBound = false,
  onBind,
  courseRepos = defaultCourseRepos,
}: GitHubBindingCardProps) {
  return (
    <Card className="p-6 bg-[#1E2028] space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">GitHub 帳號</h3>
        <p className="text-sm text-gray-400">綁定 GitHub 帳號後，可享受更多功能</p>
      </div>

      {/* Binding Status */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4">
          {/* GitHub Icon */}
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
            <Github className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <p className="text-white font-medium">
              {isBound ? 'GitHub 帳號已綁定' : '尚未綁定 GitHub 帳號'}
            </p>
          </div>
        </div>

        {!isBound && (
          <button
            onClick={onBind}
            className="flex items-center gap-2 px-4 py-2 border-2 border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700] hover:text-gray-900 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>綁定 GitHub</span>
          </button>
        )}
      </div>

      {/* Course GitHub Repos Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white mb-4">課程 GitHub Repos</h3>

        {/* Alert Box */}
        <div className="flex gap-3 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
          <p className="text-[#FFD700] text-sm font-medium">
            購買 AI x BDD 課程後，即可加入以下課程專屬的 GitHub Repos！
          </p>
        </div>

        {/* Repos List */}
        <div className="space-y-4">
          {courseRepos.map((repo, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{repo.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{repo.repoPath}</p>
                <p className="text-xs text-gray-500">{repo.description}</p>
              </div>
              <button
                disabled={!repo.isPurchased}
                className="ml-4 px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
              >
                特定課程專屬
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
