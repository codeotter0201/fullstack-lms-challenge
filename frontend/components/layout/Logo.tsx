/**
 * Logo 標誌元件
 *
 * 用於導航列和頁腳
 */

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
}

const textSizeStyles = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export default function Logo({
  size = 'md',
  showText = true,
  className
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2',
        'hover:opacity-80 transition-opacity',
        className
      )}
    >
      {/* Logo 圖示 (使用文字代替，實際專案可替換為圖片) */}
      <div className={cn(
        'bg-primary-500 text-white',
        'flex items-center justify-center',
        'rounded-lg font-bold',
        'px-2',
        sizeStyles[size]
      )}>
        <span className={textSizeStyles[size]}>W</span>
      </div>

      {/* Logo 文字 */}
      {showText && (
        <span className={cn(
          'font-bold text-gray-900',
          textSizeStyles[size]
        )}>
          Waterball
        </span>
      )}
    </Link>
  )
}
