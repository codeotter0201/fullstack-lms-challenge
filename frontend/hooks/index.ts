/**
 * Custom Hooks 導出索引
 *
 * 統一導出所有自訂 Hooks
 */

// Context Hooks (從 contexts 導出)
export { useAuth } from '@/contexts/AuthContext'
export { useToast } from '@/contexts/ToastContext'
export { useJourney } from '@/contexts/JourneyContext'
export { useLeaderboard } from '@/contexts/LeaderboardContext'

// Utility Hooks
export { useLocalStorage } from './useLocalStorage'
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsTabletOrDesktop, useDeviceType } from './useMediaQuery'
export { useDebounce } from './useDebounce'
export { useToggle } from './useToggle'
export { useClickOutside } from './useClickOutside'

// Feature Hooks
export { useVideoPlayer } from './useVideoPlayer'
export { usePagination } from './usePagination'
export { useForm } from './useForm'
