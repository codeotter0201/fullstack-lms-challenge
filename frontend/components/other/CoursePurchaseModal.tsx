/**
 * CoursePurchaseModal 課程購買彈窗
 *
 * 用於顯示課程購買流程，包含價格、折扣、付款方式選擇
 */

'use client'

import { useState } from 'react'
import { Modal, Button, Card } from '@/components/ui'
import { Check, CreditCard, Smartphone, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CoursePurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  courseName: string
  courseImage?: string
  originalPrice: number
  discountAmount?: number
  onPurchaseConfirm: (paymentMethod: PaymentMethod) => void
}

export type PaymentMethod = 'credit_card' | 'atm' | 'mobile'

const paymentMethods = [
  {
    id: 'credit_card' as PaymentMethod,
    name: '信用卡',
    icon: CreditCard,
    description: '支援 Visa、Mastercard、JCB',
  },
  {
    id: 'atm' as PaymentMethod,
    name: 'ATM 轉帳',
    icon: Building2,
    description: '虛擬帳號繳費，3 日內完成',
  },
  {
    id: 'mobile' as PaymentMethod,
    name: '行動支付',
    icon: Smartphone,
    description: '街口支付',
  },
]

export default function CoursePurchaseModal({
  isOpen,
  onClose,
  courseName,
  courseImage,
  originalPrice,
  discountAmount = 0,
  onPurchaseConfirm,
}: CoursePurchaseModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('credit_card')
  const [agreed, setAgreed] = useState(false)

  const finalPrice = originalPrice - discountAmount

  const handleConfirm = () => {
    if (!agreed) {
      alert('請先同意購買條款')
      return
    }
    onPurchaseConfirm(selectedPayment)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="確認購買"
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!agreed}
          >
            確認購買 NT$ {finalPrice.toLocaleString()}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 課程資訊 */}
        <div className="flex gap-4 p-4 bg-background-secondary rounded-lg">
          {courseImage && (
            <div className="w-24 h-16 rounded overflow-hidden bg-background-tertiary flex-shrink-0">
              <img
                src={courseImage}
                alt={courseName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-text-primary mb-1">{courseName}</h3>
            <p className="text-sm text-text-secondary">終身存取 • 包含所有更新</p>
          </div>
        </div>

        {/* 價格資訊 */}
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">課程原價</span>
              <span className="text-text-primary">NT$ {originalPrice.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-status-success">
                <span>折扣優惠</span>
                <span>- NT$ {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-text-primary">應付金額</span>
              <span className="text-primary">NT$ {finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* 付款方式選擇 */}
        <div>
          <h3 className="font-bold text-text-primary mb-3">選擇付款方式</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedPayment === method.id

              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all',
                    'hover:border-primary/50',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background-secondary'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      isSelected ? 'bg-primary/20' : 'bg-background-tertiary'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-6 h-6',
                        isSelected ? 'text-primary' : 'text-text-secondary'
                      )}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-text-primary">{method.name}</div>
                    <div className="text-sm text-text-secondary">{method.description}</div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 購買條款同意 */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 rounded border-border bg-background-tertiary"
          />
          <label htmlFor="agree-terms" className="text-sm text-text-secondary cursor-pointer">
            我已閱讀並同意{' '}
            <a href="/terms" className="text-primary hover:underline">
              購買條款
            </a>{' '}
            與{' '}
            <a href="/refund-policy" className="text-primary hover:underline">
              退款政策
            </a>
          </label>
        </div>
      </div>
    </Modal>
  )
}
