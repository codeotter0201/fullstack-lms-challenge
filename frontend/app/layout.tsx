/**
 * Root Layout
 *
 * Next.js 14 App Router 根佈局
 * 整合全域 Providers、字體、metadata
 */

import type { Metadata } from 'next'
import { Inter, Noto_Sans_TC } from 'next/font/google'
import { AppProviders } from '@/contexts'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Waterball 學院 - 軟體工程師培訓平台',
  description: '專業的軟體工程師培訓平台，提供系統化課程與實戰練習',
  keywords: ['軟體工程', '程式設計', '線上課程', 'Waterball'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSansTC.variable}`}>
      <body className="font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
