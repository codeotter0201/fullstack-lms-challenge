/**
 * 挑戰歷程頁面 (使用者作品集/學習歷程)
 *
 * 展示使用者的學習成果、完成的挑戰、獲得的徽章等
 */

'use client'

import { MainLayout, Container, Section } from '@/components/layout'
import { TrendingUp, Award, BookOpen, Code, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '@/contexts'

export default function PortfolioPage() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <Section className="py-12">
        <Container>
          {/* 頁面標題 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">挑戰歷程</h1>
            </div>
            <p className="text-text-secondary">
              {user?.nickname || user?.name}的學習旅程與成就記錄
            </p>
          </div>

          {/* 學習統計 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-background-tertiary border border-border rounded-lg p-6 text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">0</p>
              <p className="text-sm text-text-secondary">完成課程</p>
            </div>
            <div className="bg-background-tertiary border border-border rounded-lg p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">0</p>
              <p className="text-sm text-text-secondary">通過挑戰</p>
            </div>
            <div className="bg-background-tertiary border border-border rounded-lg p-6 text-center">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">0</p>
              <p className="text-sm text-text-secondary">獲得徽章</p>
            </div>
            <div className="bg-background-tertiary border border-border rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary">0</p>
              <p className="text-sm text-text-secondary">學習時數</p>
            </div>
          </div>

          {/* 最近完成的挑戰 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">最近完成的挑戰</h2>
            <div className="bg-background-tertiary border border-border rounded-lg p-8 text-center">
              <Code className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">尚未完成任何挑戰</p>
              <p className="text-sm text-text-muted mt-2">
                開始學習課程並完成挑戰，你的成果將會顯示在這裡
              </p>
            </div>
          </div>

          {/* 獲得的徽章 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">獲得的徽章</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* 空狀態：未獲得徽章 */}
              <div className="bg-background-tertiary border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center aspect-square opacity-50">
                <Award className="w-8 h-8 text-text-muted mb-2" />
                <p className="text-xs text-text-muted text-center">尚未解鎖</p>
              </div>
              <div className="bg-background-tertiary border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center aspect-square opacity-50">
                <Award className="w-8 h-8 text-text-muted mb-2" />
                <p className="text-xs text-text-muted text-center">尚未解鎖</p>
              </div>
              <div className="bg-background-tertiary border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center aspect-square opacity-50">
                <Award className="w-8 h-8 text-text-muted mb-2" />
                <p className="text-xs text-text-muted text-center">尚未解鎖</p>
              </div>
              <div className="bg-background-tertiary border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center aspect-square opacity-50">
                <Award className="w-8 h-8 text-text-muted mb-2" />
                <p className="text-xs text-text-muted text-center">尚未解鎖</p>
              </div>
              <div className="bg-background-tertiary border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center aspect-square opacity-50">
                <Award className="w-8 h-8 text-text-muted mb-2" />
                <p className="text-xs text-text-muted text-center">尚未解鎖</p>
              </div>
              <div className="bg-background-tertiary border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center aspect-square opacity-50">
                <Award className="w-8 h-8 text-text-muted mb-2" />
                <p className="text-xs text-text-muted text-center">尚未解鎖</p>
              </div>
            </div>
          </div>

          {/* 學習軌跡 */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">學習軌跡</h2>
            <div className="bg-background-tertiary border border-border rounded-lg p-8 text-center">
              <TrendingUp className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">暫無學習記錄</p>
              <p className="text-sm text-text-muted mt-2">
                開始你的學習之旅，追蹤每天的進步
              </p>
            </div>
          </div>

          {/* 提示訊息 */}
          <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-text-secondary">
              💡 <span className="font-medium text-text-primary">提示：</span>
              完成更多挑戰、獲得徽章，打造你的專業作品集，展示給未來的雇主
            </p>
          </div>
        </Container>
      </Section>
    </MainLayout>
  )
}
