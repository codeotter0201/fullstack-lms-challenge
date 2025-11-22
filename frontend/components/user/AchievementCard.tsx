/**
 * AchievementCard 成就卡片元件
 *
 * 用於顯示單個成就/徽章的詳細資訊
 */

import { cn } from '@/lib/utils'
import { Badge as BadgeComponent } from '@/components/ui'
import {
  Trophy,
  Medal,
  Award,
  Star,
  Zap,
  Crown,
  Target,
  Flame,
} from 'lucide-react'

export type AchievementType =
  | 'first_lesson'
  | 'first_gym'
  | 'course_complete'
  | 'level_milestone'
  | 'study_streak'
  | 'perfect_score'
  | 'speed_learner'
  | 'dedicated_learner'

export interface Achievement {
  id: string
  type: AchievementType
  name: string
  description: string
  icon?: AchievementType
  earnedAt?: number // timestamp
  progress?: number // 0-100
  requirement?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

interface AchievementCardProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
  locked?: boolean
  showProgress?: boolean
  className?: string
}

// 成就圖標映射
const achievementIcons: Record<AchievementType, React.ComponentType<any>> = {
  first_lesson: BookOpen,
  first_gym: Trophy,
  course_complete: Award,
  level_milestone: Star,
  study_streak: Flame,
  perfect_score: Crown,
  speed_learner: Zap,
  dedicated_learner: Medal,
}

// 稀有度配色
const rarityColors = {
  common: {
    gradient: 'from-gray-400 to-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
  rare: {
    gradient: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
  },
  epic: {
    gradient: 'from-purple-400 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-700',
  },
  legendary: {
    gradient: 'from-yellow-400 to-orange-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
  },
}

// 稀有度名稱
const rarityNames = {
  common: '普通',
  rare: '稀有',
  epic: '史詩',
  legendary: '傳說',
}

// 尺寸配置
const sizeConfig = {
  sm: {
    card: 'p-3',
    icon: 'w-10 h-10',
    iconSize: 'w-5 h-5',
    title: 'text-sm',
    desc: 'text-xs',
  },
  md: {
    card: 'p-4',
    icon: 'w-14 h-14',
    iconSize: 'w-7 h-7',
    title: 'text-base',
    desc: 'text-sm',
  },
  lg: {
    card: 'p-6',
    icon: 'w-20 h-20',
    iconSize: 'w-10 h-10',
    title: 'text-lg',
    desc: 'text-base',
  },
}

// 修復導入問題
import { BookOpen } from 'lucide-react'

export default function AchievementCard({
  achievement,
  size = 'md',
  locked = false,
  showProgress = true,
  className,
}: AchievementCardProps) {
  const rarity = achievement.rarity || 'common'
  const isEarned = !!achievement.earnedAt
  const colors = rarityColors[rarity]
  const sizes = sizeConfig[size]
  const Icon = achievementIcons[achievement.icon || achievement.type]

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 transition-all duration-300',
        sizes.card,
        isEarned && !locked && colors.bg,
        isEarned && !locked && colors.border,
        isEarned && !locked && 'shadow-md hover:shadow-lg hover:scale-105',
        locked && 'bg-gray-100 border-gray-300 opacity-60',
        !isEarned && !locked && 'bg-white border-gray-200',
        className
      )}
    >
      {/* 稀有度標籤 */}
      {isEarned && !locked && (
        <div className="absolute top-2 right-2">
          <BadgeComponent
            variant={
              rarity === 'legendary' ? 'warning' :
              rarity === 'epic' ? 'success' :
              rarity === 'rare' ? 'primary' :
              'default'
            }
            size="sm"
          >
            {rarityNames[rarity]}
          </BadgeComponent>
        </div>
      )}

      {/* 主要內容 */}
      <div className="flex items-start gap-3">
        {/* 圖標 */}
        <div
          className={cn(
            'flex-shrink-0 rounded-full flex items-center justify-center',
            sizes.icon,
            isEarned && !locked && `bg-gradient-to-br ${colors.gradient}`,
            locked && 'bg-gray-400',
            !isEarned && !locked && 'bg-gray-300'
          )}
        >
          <Icon
            className={cn(
              sizes.iconSize,
              isEarned && !locked ? 'text-white' : 'text-gray-600'
            )}
          />
        </div>

        {/* 文字內容 */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-bold mb-1',
              sizes.title,
              isEarned && !locked && colors.text,
              locked && 'text-gray-500',
              !isEarned && !locked && 'text-gray-700'
            )}
          >
            {locked ? '???' : achievement.name}
          </h4>

          <p
            className={cn(
              'text-gray-600 leading-relaxed',
              sizes.desc,
              locked && 'text-gray-500'
            )}
          >
            {locked ? '完成特定條件後解鎖' : achievement.description}
          </p>

          {/* 達成時間 */}
          {isEarned && achievement.earnedAt && !locked && (
            <p className="text-xs text-gray-500 mt-2">
              {new Date(achievement.earnedAt).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}

          {/* 達成要求 */}
          {!isEarned && !locked && achievement.requirement && (
            <p className="text-xs text-gray-500 mt-2">
              {achievement.requirement}
            </p>
          )}

          {/* 進度條 */}
          {showProgress && !isEarned && !locked && achievement.progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">進度</span>
                <span className="text-xs font-medium text-primary-600">
                  {achievement.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 已解鎖效果 */}
      {isEarned && !locked && (
        <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <Trophy className="w-full h-full transform rotate-12" />
          </div>
        </div>
      )}
    </div>
  )
}
