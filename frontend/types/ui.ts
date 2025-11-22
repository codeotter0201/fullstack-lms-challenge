/**
 * UI 元件通用型別定義
 *
 * 定義所有 UI 元件共用的 Props、狀態等型別
 */

import { ReactNode } from 'react'

/**
 * 按鈕變體
 */
export type ButtonVariant =
  | 'primary'      // 主要按鈕 (藍色背景)
  | 'secondary'    // 次要按鈕 (灰色背景)
  | 'outline'      // 外框按鈕
  | 'ghost'        // 幽靈按鈕 (透明背景)
  | 'danger'       // 危險按鈕 (紅色)
  | 'success'      // 成功按鈕 (綠色)

/**
 * 按鈕尺寸
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * 按鈕 Props
 */
export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  children: ReactNode
}

/**
 * 卡片變體
 */
export type CardVariant =
  | 'default'      // 預設卡片
  | 'elevated'     // 浮起卡片 (有陰影)
  | 'outline'      // 外框卡片
  | 'flat'         // 扁平卡片 (無邊框陰影)

/**
 * 卡片 Props
 */
export interface CardProps {
  variant?: CardVariant
  hoverable?: boolean      // 是否有 hover 效果
  clickable?: boolean      // 是否可點擊
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  children: ReactNode
}

/**
 * 徽章變體
 */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

/**
 * 徽章尺寸
 */
export type BadgeSize = 'sm' | 'md' | 'lg'

/**
 * 徽章 Props
 */
export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  rounded?: boolean        // 是否為圓形
  className?: string
  children: ReactNode
}

/**
 * 頭像尺寸
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/**
 * 頭像 Props
 */
export interface AvatarProps {
  src: string
  alt: string
  size?: AvatarSize
  rounded?: boolean        // 是否為圓形 (預設 true)
  badge?: ReactNode       // 頭像角標 (如等級)
  className?: string
  onClick?: () => void
}

/**
 * 輸入框尺寸
 */
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * 輸入框 Props
 */
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  size?: InputSize
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  error?: string          // 錯誤訊息
  helperText?: string     // 輔助文字
  icon?: ReactNode       // 前置圖示
  suffix?: ReactNode     // 後置元素
  fullWidth?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
}

/**
 * Modal 尺寸
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Modal Props
 */
export interface ModalProps {
  open: boolean
  size?: ModalSize
  title?: string
  closable?: boolean      // 是否顯示關閉按鈕
  maskClosable?: boolean  // 點擊遮罩是否關閉
  footer?: ReactNode      // 自訂 footer
  onClose: () => void
  className?: string
  children: ReactNode
}

/**
 * Dropdown 位置
 */
export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'top-start'
  | 'top'
  | 'top-end'

/**
 * Dropdown 項目
 */
export interface DropdownItem {
  key: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  divider?: boolean       // 是否顯示分隔線
  onClick?: () => void
}

/**
 * Dropdown Props
 */
export interface DropdownProps {
  items: DropdownItem[]
  placement?: DropdownPlacement
  trigger?: 'click' | 'hover'
  className?: string
  children: ReactNode
}

/**
 * Toast 類型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/**
 * Toast 訊息
 */
export interface ToastMessage {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number       // 顯示時長 (毫秒)
  closable?: boolean
}

/**
 * Progress Bar Props
 */
export interface ProgressBarProps {
  percentage: number      // 0-100
  showLabel?: boolean
  color?: string
  height?: number
  animated?: boolean
  striped?: boolean
  className?: string
}

/**
 * Tabs 項目
 */
export interface TabItem {
  key: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  content: ReactNode
}

/**
 * Tabs Props
 */
export interface TabsProps {
  items: TabItem[]
  defaultActiveKey?: string
  activeKey?: string
  onChange?: (key: string) => void
  type?: 'line' | 'card'
  centered?: boolean
  className?: string
}

/**
 * Skeleton Props
 */
export interface SkeletonProps {
  loading: boolean
  rows?: number          // 行數
  avatar?: boolean       // 是否顯示頭像骨架
  title?: boolean        // 是否顯示標題骨架
  active?: boolean       // 是否有動畫
  className?: string
  children?: ReactNode
}

/**
 * Empty State Props
 */
export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode     // 操作按鈕
  className?: string
}

/**
 * Spinner 尺寸
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Spinner Props
 */
export interface SpinnerProps {
  size?: SpinnerSize
  color?: string
  className?: string
}

/**
 * 通用 className 生成器
 */
export type ClassNameProp = string | string[] | Record<string, boolean>

/**
 * 通用載入狀態
 */
export interface LoadingState {
  isLoading: boolean
  error?: string
}

/**
 * 分頁資訊
 */
export interface Pagination {
  current: number
  pageSize: number
  total: number
  totalPages: number
}

/**
 * 分頁 Props
 */
export interface PaginationProps extends Pagination {
  onChange: (page: number) => void
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  className?: string
}

/**
 * Select 選項
 */
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  icon?: ReactNode
}

/**
 * Select Props
 */
export interface SelectProps {
  options: SelectOption[]
  value?: string | number
  defaultValue?: string | number
  placeholder?: string
  disabled?: boolean
  error?: string
  size?: InputSize
  searchable?: boolean
  clearable?: boolean
  multiple?: boolean
  onChange?: (value: string | number | Array<string | number>) => void
  className?: string
}

/**
 * Checkbox Props
 */
export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  indeterminate?: boolean  // 半選狀態
  label?: string
  onChange?: (checked: boolean) => void
  className?: string
}

/**
 * Form Field Props
 */
export interface FormFieldProps {
  label?: string
  required?: boolean
  error?: string
  helperText?: string
  className?: string
  children: ReactNode
}

/**
 * 主題顏色
 */
export type ThemeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'dark'
  | 'light'
