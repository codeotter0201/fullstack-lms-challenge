/**
 * UserProfileHeader Component
 *
 * 用戶頭像與名稱區塊
 * - 大型圓形頭像（160px）
 * - 用戶名稱顯示
 */

import { User } from '@/types/user'
import Avatar from '@/components/ui/Avatar'

export interface UserProfileHeaderProps {
  user: User
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const displayName = user.nickname || user.name || user.email || '用戶'
  const userId = user.userId || user.id
  const userTag = `${displayName}${userId ? ` #${userId}` : ''}`

  return (
    <div className="flex flex-col items-center py-8">
      <Avatar
        src={user.pictureUrl || '/blog/avatar.webp'}
        alt={displayName}
        size="3xl"
        className="mb-4"
      />
      <h1 className="text-2xl font-bold text-white">
        {userTag}
      </h1>
    </div>
  )
}
