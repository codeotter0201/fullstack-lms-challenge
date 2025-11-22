/**
 * 獎勵任務頁面
 *
 * 顯示所有可獲得獎勵的任務和挑戰
 */

'use client'

import { MainLayout, Container, Section } from '@/components/layout'
import { Award, Gift, Trophy, Star } from 'lucide-react'

export default function MissionsRewardsPage() {
  return (
    <MainLayout>
      <Section className="py-12">
        <Container>
          {/* 頁面標題 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">獎勵任務</h1>
            </div>
            <p className="text-text-secondary">
              完成任務即可獲得豐厚獎勵，包括折價券、徽章、經驗值等
            </p>
          </div>

          {/* 任務分類 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 每日任務 */}
            <div className="bg-background-tertiary border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-text-primary">每日任務</h2>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                每天完成任務即可獲得獎勵
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">登入學習平台</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: +10 經驗值</p>
                </div>
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">完成一個章節</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: +50 經驗值</p>
                </div>
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">通過一個挑戰</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: +100 經驗值</p>
                </div>
              </div>
            </div>

            {/* 週任務 */}
            <div className="bg-background-tertiary border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-text-primary">週任務</h2>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                本週完成指定任務獲得額外獎勵
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">完成 5 個章節</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: +300 經驗值</p>
                </div>
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">通過 3 個挑戰</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: +500 經驗值</p>
                </div>
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">累計學習 5 小時</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: +200 經驗值</p>
                </div>
              </div>
            </div>

            {/* 特殊獎勵 */}
            <div className="bg-background-tertiary border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-text-primary">特殊獎勵</h2>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                限時活動與特殊成就獎勵
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-background-secondary rounded-md border-2 border-primary">
                  <p className="text-sm text-text-primary font-medium">
                    完成體驗課程
                  </p>
                  <p className="text-xs text-primary mt-1 font-semibold">
                    獎勵: 3000 元折價券 🎉
                  </p>
                </div>
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">首次購買課程</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: 限定徽章</p>
                </div>
                <div className="p-3 bg-background-secondary rounded-md">
                  <p className="text-sm text-text-primary font-medium">完成第一門課程</p>
                  <p className="text-xs text-text-muted mt-1">獎勵: 成就徽章 + 1000 經驗值</p>
                </div>
              </div>
            </div>
          </div>

          {/* 提示訊息 */}
          <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-text-secondary">
              💡 <span className="font-medium text-text-primary">提示：</span>
              定期完成任務可以快速提升等級,解鎖更多課程內容和專屬獎勵
            </p>
          </div>
        </Container>
      </Section>
    </MainLayout>
  )
}
