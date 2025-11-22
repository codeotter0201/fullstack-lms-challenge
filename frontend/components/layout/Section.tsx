/**
 * Section 區塊元件
 *
 * 用於組織頁面內容區塊
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: ReactNode
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'white' | 'gray' | 'transparent'
  className?: string
}

const spacingStyles = {
  none: '',
  sm: 'py-6',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16',
}

const backgroundStyles = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  transparent: 'bg-transparent',
}

export default function Section({
  children,
  title,
  subtitle,
  action,
  spacing = 'md',
  background = 'transparent',
  className,
}: SectionProps) {
  return (
    <section
      className={cn(
        spacingStyles[spacing],
        backgroundStyles[background],
        className
      )}
    >
      {/* 標題區 */}
      {(title || subtitle || action) && (
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>

            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 內容 */}
      {children}
    </section>
  )
}
