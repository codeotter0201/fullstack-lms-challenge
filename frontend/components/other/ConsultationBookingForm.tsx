/**
 * ConsultationBookingForm 1v1 諮詢預約表單
 *
 * 用於預約與講師的一對一諮詢時段
 */

'use client'

import { useState } from 'react'
import { Modal, Button, Input, FormField } from '@/components/ui'
import { Calendar, Clock, User, Mail, MessageSquare } from 'lucide-react'

export interface ConsultationBookingFormProps {
  isOpen: boolean
  onClose: () => void
  instructorName: string
  onSubmit: (data: ConsultationBookingData) => void
}

export interface ConsultationBookingData {
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  topic: string
  message: string
}

const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
]

const topics = [
  '職涯諮詢',
  '技術問題討論',
  '專案指導',
  '學習規劃',
  '其他'
]

export default function ConsultationBookingForm({
  isOpen,
  onClose,
  instructorName,
  onSubmit,
}: ConsultationBookingFormProps) {
  const [formData, setFormData] = useState<ConsultationBookingData>({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    topic: '',
    message: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ConsultationBookingData, string>>>({})

  const handleChange = (field: keyof ConsultationBookingData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 清除該欄位的錯誤
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ConsultationBookingData, string>> = {}

    if (!formData.name.trim()) newErrors.name = '請輸入姓名'
    if (!formData.email.trim()) {
      newErrors.email = '請輸入電子郵件'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入電話號碼'
    } else if (!/^09\d{8}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = '請輸入有效的手機號碼'
    }
    if (!formData.preferredDate) newErrors.preferredDate = '請選擇希望日期'
    if (!formData.preferredTime) newErrors.preferredTime = '請選擇時段'
    if (!formData.topic) newErrors.topic = '請選擇諮詢主題'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`預約與 ${instructorName} 的 1v1 諮詢`}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            確認預約
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 說明 */}
        <div className="p-4 bg-background-secondary rounded-lg border border-border">
          <p className="text-sm text-text-secondary">
            預約成功後，講師將於 24 小時內與您聯繫確認諮詢時間。每次諮詢時間為 1 小時。
          </p>
        </div>

        {/* 聯絡資訊 */}
        <div className="space-y-4">
          <h3 className="font-bold text-text-primary">聯絡資訊</h3>

          <FormField
            label="姓名"
            required
            error={errors.name}
          >
            <Input
              icon={<User className="w-5 h-5" />}
              placeholder="請輸入您的姓名"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
            />
          </FormField>

          <FormField
            label="電子郵件"
            required
            error={errors.email}
          >
            <Input
              icon={<Mail className="w-5 h-5" />}
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
            />
          </FormField>

          <FormField
            label="手機號碼"
            required
            error={errors.phone}
          >
            <Input
              icon={<User className="w-5 h-5" />}
              type="tel"
              placeholder="0912345678"
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
            />
          </FormField>
        </div>

        {/* 預約時間 */}
        <div className="space-y-4">
          <h3 className="font-bold text-text-primary">預約時間</h3>

          <FormField
            label="希望日期"
            required
            error={errors.preferredDate}
          >
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleChange('preferredDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </FormField>

          <FormField
            label="希望時段"
            required
            error={errors.preferredTime}
          >
            <select
              value={formData.preferredTime}
              onChange={(e) => handleChange('preferredTime', e.target.value)}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="">請選擇時段</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* 諮詢主題 */}
        <div className="space-y-4">
          <h3 className="font-bold text-text-primary">諮詢主題</h3>

          <FormField
            label="主題類型"
            required
            error={errors.topic}
          >
            <select
              value={formData.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="">請選擇主題</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="詳細說明（選填）"
          >
            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="請簡述您想諮詢的內容..."
              rows={4}
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary resize-none"
            />
          </FormField>
        </div>
      </div>
    </Modal>
  )
}
