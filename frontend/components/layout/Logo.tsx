/**
 * Logo 標誌元件
 *
 * 用於導航列和頁腳
 */

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-32 w-32',
}

const imageSizes = {
  sm: 32,
  md: 48,
  lg: 80,
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
        'flex items-center gap-3',
        'hover:opacity-80 transition-opacity',
        className
      )}
    >
      {/* Logo 圖片 */}
      <div className={cn('relative', sizeStyles[size])}>
        <Image
          src="/images/logo.png"
          alt="Waterball Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Logo 文字 */}
      {showText && (
        <span className={cn(
          'font-bold text-text',
          textSizeStyles[size]
        )}>
          Waterball
        </span>
      )}
    </Link>
  )
}
