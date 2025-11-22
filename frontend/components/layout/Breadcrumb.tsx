/**
 * Breadcrumb 麵包屑導航元件
 *
 * 用於顯示當前頁面路徑
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export default function Breadcrumb({
  items,
  showHome = true,
  className,
}: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: '首頁', href: '/', icon: <Home className="w-4 h-4" /> }, ...items]
    : items

  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {/* 項目 */}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  'flex items-center gap-1.5',
                  isLast ? 'text-gray-900 font-medium' : 'text-gray-600'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}

            {/* 分隔符 */}
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
