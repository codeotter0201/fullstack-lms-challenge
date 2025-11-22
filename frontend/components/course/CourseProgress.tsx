/**
 * CourseProgress 課程進度元件
 *
 * 用於顯示課程學習進度統計
 */

import { cn } from '@/lib/utils'
import { Card, ProgressBar, Badge } from '@/components/ui'
import { Video, Award, Trophy, CheckCircle } from 'lucide-react'

interface CourseProgressProps {
  totalLessons: number
  completedLessons: number
  totalGyms?: number
  passedGyms?: number
  totalExp: number
  earnedExp: number
  showDetails?: boolean
  className?: string
}

export default function CourseProgress({
  totalLessons,
  completedLessons,
  totalGyms = 0,
  passedGyms = 0,
  totalExp,
  earnedExp,
  showDetails = true,
  className,
}: CourseProgressProps) {
  const lessonPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0

  const gymPercentage = totalGyms > 0
    ? Math.round((passedGyms / totalGyms) * 100)
    : 0

  const expPercentage = totalExp > 0
    ? Math.round((earnedExp / totalExp) * 100)
    : 0

  const isCompleted = lessonPercentage === 100 && (totalGyms === 0 || gymPercentage === 100)

  return (
    <Card className={cn('', className)}>
      {/* 標題 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">學習進度</h3>
        {isCompleted && (
          <Badge variant="success" className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            已完成
          </Badge>
        )}
      </div>

      {/* 整體進度 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">整體完成度</span>
          <span className="text-2xl font-bold text-primary-600">
            {lessonPercentage}%
          </span>
        </div>
        <ProgressBar
          percentage={lessonPercentage}
          height={12}
          color="bg-gradient-to-r from-primary-500 to-primary-600"
        />
      </div>

      {/* 詳細統計 */}
      {showDetails && (
        <div className="space-y-4">
          {/* 單元進度 */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">完成單元</p>
                <p className="text-xs text-gray-600">
                  {completedLessons} / {totalLessons}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">
                {lessonPercentage}%
              </p>
            </div>
          </div>

          {/* 道館進度（如果有） */}
          {totalGyms > 0 && (
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">通過道館</p>
                  <p className="text-xs text-gray-600">
                    {passedGyms} / {totalGyms}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-600">
                  {gymPercentage}%
                </p>
              </div>
            </div>
          )}

          {/* 經驗值進度 */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">獲得經驗</p>
                <p className="text-xs text-gray-600">
                  {earnedExp.toLocaleString()} / {totalExp.toLocaleString()} EXP
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                {expPercentage}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 完成提示 */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                恭喜！你已完成此課程
              </p>
              <p className="text-xs text-green-700 mt-1">
                你已經掌握了所有技能，繼續保持學習的熱情！
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
