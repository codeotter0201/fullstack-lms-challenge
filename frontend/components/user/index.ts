/**
 * User 用戶元件導出索引
 *
 * 統一導出所有用戶相關元件
 */

export { default as LevelBadge } from './LevelBadge'
export { default as ExpBar } from './ExpBar'
export { default as UserProfile } from './UserProfile'
export { default as UserStats } from './UserStats'
export { default as AchievementCard } from './AchievementCard'
export { default as AccountBinding } from './AccountBinding'
export { default as SocialConnect } from './SocialConnect'

// New profile page components
export { UserProfileHeader } from './UserProfileHeader'
export { ProfileTabs } from './ProfileTabs'
export { BasicInfoCard } from './BasicInfoCard'
export { DiscordBindingCard } from './DiscordBindingCard'
export { GitHubBindingCard } from './GitHubBindingCard'

// 導出 AchievementCard 的類型
export type { Achievement, AchievementType } from './AchievementCard'
export type { UserProfileHeaderProps } from './UserProfileHeader'
export type { ProfileTabsProps } from './ProfileTabs'
export type { BasicInfoCardProps } from './BasicInfoCard'
export type { DiscordBindingCardProps } from './DiscordBindingCard'
export type { GitHubBindingCardProps, CourseRepo } from './GitHubBindingCard'
