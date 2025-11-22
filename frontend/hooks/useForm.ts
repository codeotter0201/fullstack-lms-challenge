/**
 * useForm Hook
 *
 * 用於管理表單狀態與驗證
 */

'use client'

import { useState, useCallback, ChangeEvent } from 'react'

interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

interface FieldConfig<T> {
  initialValue: T
  validation?: ValidationRule<T>[]
}

interface UseFormConfig<T extends Record<string, any>> {
  initialValues: T
  validations?: {
    [K in keyof T]?: ValidationRule<T[K]>[]
  }
  onSubmit: (values: T) => void | Promise<void>
}

interface UseFormReturn<T extends Record<string, any>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  handleChange: (name: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (name: keyof T) => () => void
  setValue: <K extends keyof T>(name: K, value: T[K]) => void
  setError: (name: keyof T, error: string) => void
  clearError: (name: keyof T) => void
  validateField: (name: keyof T) => boolean
  validateForm: () => boolean
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  reset: () => void
}

/**
 * useForm Hook
 *
 * @param config - 表單配置
 *
 * @example
 * const form = useForm({
 *   initialValues: {
 *     email: '',
 *     password: '',
 *   },
 *   validations: {
 *     email: [
 *       {
 *         validate: (value) => value.includes('@'),
 *         message: '請輸入有效的電子郵件',
 *       },
 *     ],
 *     password: [
 *       {
 *         validate: (value) => value.length >= 6,
 *         message: '密碼至少需要 6 個字符',
 *       },
 *     ],
 *   },
 *   onSubmit: async (values) => {
 *     await login(values)
 *   },
 * })
 *
 * <form onSubmit={form.handleSubmit}>
 *   <Input
 *     value={form.values.email}
 *     onChange={form.handleChange('email')}
 *     onBlur={form.handleBlur('email')}
 *     error={form.touched.email ? form.errors.email : undefined}
 *   />
 * </form>
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validations = {},
  onSubmit,
}: UseFormConfig<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 處理輸入變化
  const handleChange = useCallback(
    (name: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value as T[keyof T]
      setValues(prev => ({ ...prev, [name]: value }))

      // 如果已經 touched，即時驗證
      if (touched[name]) {
        validateField(name, value)
      }
    },
    [touched]
  )

  // 處理失焦
  const handleBlur = useCallback((name: keyof T) => () => {
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name)
  }, [])

  // 設定值
  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  // 設定錯誤
  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  // 清除錯誤
  const clearError = useCallback((name: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  // 驗證單一欄位
  const validateField = useCallback(
    (name: keyof T, value?: T[keyof T]): boolean => {
      const fieldValue = value !== undefined ? value : values[name]
      const rules = validations[name]

      if (!rules || rules.length === 0) {
        clearError(name)
        return true
      }

      for (const rule of rules) {
        if (!rule.validate(fieldValue)) {
          setError(name, rule.message)
          return false
        }
      }

      clearError(name)
      return true
    },
    [values, validations, setError, clearError]
  )

  // 驗證整個表單
  const validateForm = useCallback((): boolean => {
    let isValid = true
    const newErrors: Partial<Record<keyof T, string>> = {}

    for (const name in validations) {
      const rules = validations[name]
      if (!rules || rules.length === 0) continue

      const value = values[name]

      for (const rule of rules) {
        if (!rule.validate(value)) {
          newErrors[name] = rule.message
          isValid = false
          break
        }
      }
    }

    setErrors(newErrors)

    // 標記所有欄位為 touched
    const allTouched: Partial<Record<keyof T, boolean>> = {}
    for (const name in values) {
      allTouched[name] = true
    }
    setTouched(allTouched)

    return isValid
  }, [values, validations])

  // 處理提交
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      if (!validateForm()) {
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [validateForm, onSubmit, values]
  )

  // 重置表單
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setValue,
    setError,
    clearError,
    validateField,
    validateForm,
    handleSubmit,
    reset,
  }
}
