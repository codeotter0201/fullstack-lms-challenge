/**
 * Avatar 頭像元件
 *
 * 支援多種尺寸、角標、圓形/方形
 */

import { AvatarProps } from '@/types/ui'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const sizeStyles = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
  '3xl': 'w-32 h-32',
  '4xl': 'w-40 h-40',
}

const badgeSizeStyles = {
  xs: 'w-2 h-2',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  '2xl': 'w-8 h-8',
  '3xl': 'w-10 h-10',
  '4xl': 'w-12 h-12',
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  rounded = true,
  badge,
  className,
  onClick,
}: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-block',
        sizeStyles[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={96}
        height={96}
        className={cn(
          'object-cover',
          'w-full h-full',
          rounded ? 'rounded-full' : 'rounded-lg',
          'ring-2 ring-white',
          onClick && 'hover:opacity-80 transition-opacity'
        )}
      />

      {/* 角標 */}
      {badge && (
        <div
          className={cn(
            'absolute -bottom-1 -right-1',
            'flex items-center justify-center',
            'bg-primary-500 text-white',
            'rounded-full',
            'ring-2 ring-white',
            'font-bold text-xs',
            badgeSizeStyles[size]
          )}
        >
          {badge}
        </div>
      )}
    </div>
  )
}
