/**
 * PageHeader 頁面標題元件
 *
 * 用於顯示頁面標題、描述、麵包屑、操作按鈕
 */

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: ReactNode
  background?: 'white' | 'gray' | 'primary'
  className?: string
}

const backgroundStyles = {
  white: 'bg-white border-b border-gray-200',
  gray: 'bg-gray-50 border-b border-gray-200',
  primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white',
}

export default function PageHeader({
  title,
  subtitle,
  description,
  breadcrumb,
  actions,
  background = 'white',
  className,
}: PageHeaderProps) {
  const isPrimary = background === 'primary'

  return (
    <div
      className={cn(
        'py-6',
        backgroundStyles[background],
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 麵包屑 */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="mb-4">
            <Breadcrumb
              items={breadcrumb}
              className={isPrimary ? 'text-white' : undefined}
            />
          </div>
        )}

        {/* 標題區 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* 副標題 */}
            {subtitle && (
              <p
                className={cn(
                  'text-sm font-medium mb-1',
                  isPrimary ? 'text-primary-100' : 'text-primary-600'
                )}
              >
                {subtitle}
              </p>
            )}

            {/* 主標題 */}
            <h1
              className={cn(
                'text-3xl font-bold mb-2',
                isPrimary ? 'text-white' : 'text-gray-900'
              )}
            >
              {title}
            </h1>

            {/* 描述 */}
            {description && (
              <p
                className={cn(
                  'text-base max-w-3xl',
                  isPrimary ? 'text-primary-50' : 'text-gray-600'
                )}
              >
                {description}
              </p>
            )}
          </div>

          {/* 操作按鈕 */}
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
