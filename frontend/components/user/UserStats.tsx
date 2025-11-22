/**
 * UserStats 用戶統計資訊元件
 *
 * 用於顯示用戶的詳細學習統計數據
 */

import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import {
  TrendingUp,
  BookOpen,
  Award,
  Trophy,
  Clock,
  Target,
  Zap,
  Calendar,
} from 'lucide-react'

interface StatItem {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface UserStatsProps {
  stats: {
    totalExp: number
    level: number
    lessonsCompleted: number
    lessonsInProgress: number
    gymsPassed: number
    gymsAttempted: number
    badges: number
    studyStreak: number
    totalStudyTime: number // 分鐘
    avgLessonScore: number // 0-100
    lastActive: number // timestamp
  }
  layout?: 'grid' | 'list'
  className?: string
}

export default function UserStats({
  stats,
  layout = 'grid',
  className,
}: UserStatsProps) {
  // 格式化學習時間
  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}分鐘`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小時${mins}分` : `${hours}小時`
  }

  // 計算道館通過率
  const gymPassRate = stats.gymsAttempted > 0
    ? Math.round((stats.gymsPassed / stats.gymsAttempted) * 100)
    : 0

  // 統計項目配置
  const statItems: StatItem[] = [
    {
      label: '總經驗值',
      value: stats.totalExp.toLocaleString(),
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: '當前等級',
      value: `Lv.${stats.level}`,
      icon: <Zap className="w-5 h-5" />,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      label: '完成單元',
      value: stats.lessonsCompleted,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      label: '進行中',
      value: stats.lessonsInProgress,
      icon: <Target className="w-5 h-5" />,
      color: 'text-info-600',
      bgColor: 'bg-info-50',
    },
    {
      label: '通過道館',
      value: `${stats.gymsPassed}/${stats.gymsAttempted}`,
      icon: <Trophy className="w-5 h-5" />,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
    },
    {
      label: '道館通過率',
      value: `${gymPassRate}%`,
      icon: <Award className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: '獲得徽章',
      value: stats.badges,
      icon: <Award className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: '連續學習',
      value: `${stats.studyStreak}天`,
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: '學習時長',
      value: formatStudyTime(stats.totalStudyTime),
      icon: <Clock className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ]

  const isGrid = layout === 'grid'

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          isGrid && 'grid gap-4',
          isGrid && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          !isGrid && 'space-y-3'
        )}
      >
        {statItems.map((item, index) => (
          <Card
            key={index}
            className={cn(
              'p-4 hover:shadow-lg transition-all duration-200',
              'border border-gray-100'
            )}
          >
            <div className="flex items-center gap-3">
              {/* 圖標 */}
              <div
                className={cn(
                  'flex-shrink-0 w-12 h-12 rounded-lg',
                  'flex items-center justify-center',
                  item.bgColor,
                  item.color
                )}
              >
                {item.icon}
              </div>

              {/* 數據 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                <p className={cn('text-2xl font-bold', item.color)}>
                  {item.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 平均分數 - 特殊顯示 */}
      {stats.avgLessonScore > 0 && (
        <Card className="p-6 mt-4 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium mb-1">
                平均單元分數
              </p>
              <p className="text-4xl font-bold text-primary-600">
                {stats.avgLessonScore}
                <span className="text-xl text-primary-500 ml-1">分</span>
              </p>
            </div>
            <div className="text-primary-600">
              <Trophy className="w-16 h-16 opacity-20" />
            </div>
          </div>

          {/* 分數評級 */}
          <div className="mt-4 pt-4 border-t border-primary-200">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                  style={{ width: `${stats.avgLessonScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-primary-700">
                {stats.avgLessonScore >= 90 && '優秀'}
                {stats.avgLessonScore >= 70 && stats.avgLessonScore < 90 && '良好'}
                {stats.avgLessonScore >= 60 && stats.avgLessonScore < 70 && '及格'}
                {stats.avgLessonScore < 60 && '需努力'}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
