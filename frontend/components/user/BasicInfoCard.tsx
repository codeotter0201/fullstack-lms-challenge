/**
 * BasicInfoCard Component
 *
 * 基本資料卡片（兩欄佈局）
 * - 顯示用戶基本資訊
 * - 編輯按鈕
 */

'use client'

import { User } from '@/types/user'
import { Card } from '@/components/ui'
import { Edit } from 'lucide-react'

export interface BasicInfoCardProps {
  user: User
  onEdit?: () => void
}

interface InfoField {
  label: string
  value: string
}

export function BasicInfoCard({ user, onEdit }: BasicInfoCardProps) {
  const leftFields: InfoField[] = [
    { label: '暱稱', value: user.nickname || user.name || '未設定' },
    { label: '職業', value: '' },
    { label: '等級', value: user.level?.toString() || '1' },
    { label: '突破道館數', value: '0' },
    { label: 'Email', value: user.email || '未設定' },
  ]

  const rightFields: InfoField[] = [
    { label: '', value: '' },
    { label: '生日', value: user.birthday || '尚未設定' },
    { label: '性別', value: '尚未設定' },
    { label: '地區', value: '尚未設定' },
    { label: 'Github 連結', value: '...' },
  ]

  return (
    <Card className="shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-text-primary">基本資料</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-button-text transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>編輯資料</span>
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
        {/* Left Column */}
        <div className="space-y-4">
          {leftFields.map((field, index) => (
            <div key={index}>
              {field.label && (
                <div className="text-sm text-text-secondary mb-1">{field.label}</div>
              )}
              {field.value && (
                <div className="text-text-primary">{field.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {rightFields.map((field, index) => (
            <div key={index}>
              {field.label && (
                <div className="text-sm text-text-secondary mb-1">{field.label}</div>
              )}
              {field.value && (
                <div className="text-text-primary">{field.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
