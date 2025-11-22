/**
 * UserProfile 用戶個人資料卡元件
 *
 * 用於顯示用戶的完整個人資料，包含頭像、等級、經驗值等
 */

import { cn } from '@/lib/utils'
import { Avatar, Badge } from '@/components/ui'
import LevelBadge from './LevelBadge'
import ExpBar from './ExpBar'
import { User } from '@/types/user'
import { MapPin, Briefcase, Calendar, Crown } from 'lucide-react'

interface UserProfileProps {
  user: User
  showExpBar?: boolean
  showStats?: boolean
  variant?: 'card' | 'inline'
  className?: string
}

export default function UserProfile({
  user,
  showExpBar = true,
  showStats = true,
  variant = 'card',
  className,
}: UserProfileProps) {
  const isCard = variant === 'card'

  return (
    <div
      className={cn(
        isCard && 'bg-white rounded-xl shadow-md p-6 border border-gray-100',
        !isCard && 'flex items-center gap-4',
        className
      )}
    >
      {/* 頭像區域 */}
      <div className={cn(
        'flex items-center gap-4',
        isCard && 'mb-4'
      )}>
        <div className="relative">
          <Avatar
            src={user.pictureUrl}
            alt={user.nickname || user.name}
            size={isCard ? '2xl' : 'xl'}
            className="ring-4 ring-primary-100"
          />
          {/* 等級徽章 */}
          <div className="absolute -bottom-2 -right-2">
            <LevelBadge
              level={user.level}
              size={isCard ? 'lg' : 'md'}
              variant="gradient"
            />
          </div>
        </div>

        {/* 基本資訊 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-bold text-gray-900',
              isCard ? 'text-2xl' : 'text-xl'
            )}>
              {user.nickname || user.name}
            </h3>
            {user.primaryRole === 'STUDENT_PAID' && (
              <Badge variant="warning" size="sm" className="gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            )}
          </div>

          {/* 次要資訊 */}
          <div className="space-y-1">
            {user.occupation && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{user.occupation}</span>
              </div>
            )}

            {user.region && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user.region}</span>
              </div>
            )}

            {user.birthday && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>生日: {user.birthday}</span>
              </div>
            )}
          </div>

          {/* 角色標籤 */}
          {!isCard && user.roles.length > 0 && (
            <div className="flex gap-2 mt-2">
              {user.roles.map((role) => (
                <Badge
                  key={role}
                  variant={
                    role === 'ADMIN' ? 'danger' :
                    role === 'TEACHER' ? 'success' :
                    'primary'
                  }
                  size="sm"
                >
                  {role === 'ADMIN' && '管理員'}
                  {role === 'TEACHER' && '講師'}
                  {(role === 'STUDENT_FREE' || role === 'STUDENT_PAID') && '學生'}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 經驗值條 */}
      {showExpBar && isCard && (
        <div className="mb-4">
          <ExpBar
            currentExp={user.exp}
            nextLevelExp={user.nextLevelExp}
            level={user.level}
            showLabel={true}
            showLevel={true}
            size="lg"
          />
        </div>
      )}

      {/* 統計資訊 */}
      {/* 統計資訊 - R2 將從 getUserStats API 取得 */}
      {showStats && isCard && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">
              {user.level}
            </p>
            <p className="text-xs text-gray-600 mt-1">等級</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">
              {user.exp}
            </p>
            <p className="text-xs text-gray-600 mt-1">經驗值</p>
          </div>
        </div>
      )}

      {/* 自我介紹 (R2 功能) */}
    </div>
  )
}
