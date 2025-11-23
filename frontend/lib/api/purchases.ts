/**
 * Purchases API
 *
 * 課程購買相關 API
 * 整合後端購買功能
 */

import { apiClient } from './client'
import type { PurchaseDTO } from '@/types/backend'
import type { ApiResponse } from '@/types/api'

/**
 * 購買課程
 * POST /api/purchases/courses/{courseId}
 */
export async function purchaseCourse(
  courseId: number
): Promise<ApiResponse<PurchaseDTO>> {
  try {
    const response = await apiClient.post<PurchaseDTO>(
      `/purchases/courses/${courseId}`,
      {} // MVP: Empty body, no payment info needed
    )

    return {
      success: response.success,
      data: response.data,
      error: response.error,
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PURCHASE_FAILED',
        message: error instanceof Error ? error.message : '購買失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 取得我的購買記錄
 * GET /api/purchases/my-purchases
 */
export async function getMyPurchases(): Promise<ApiResponse<PurchaseDTO[]>> {
  try {
    const response = await apiClient.get<PurchaseDTO[]>('/purchases/my-purchases')

    return {
      success: response.success,
      data: response.data,
      error: response.error,
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error instanceof Error ? error.message : '無法獲取購買記錄',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 檢查是否已購買課程
 * GET /api/purchases/check/{courseId}
 */
export async function checkPurchase(
  courseId: number
): Promise<ApiResponse<{ purchased: boolean }>> {
  try {
    const response = await apiClient.get<{ purchased: boolean }>(
      `/purchases/check/${courseId}`
    )

    return {
      success: response.success,
      data: response.data,
      error: response.error,
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CHECK_FAILED',
        message: error instanceof Error ? error.message : '檢查購買狀態失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 檢查課程存取權限
 * GET /api/purchases/access/{courseId}
 *
 * 規則:
 * - 免費課程: 所有人都可存取
 * - 付費課程: 需已購買
 */
export async function checkAccess(
  courseId: number
): Promise<ApiResponse<{ hasAccess: boolean }>> {
  try {
    const response = await apiClient.get<{ hasAccess: boolean }>(
      `/purchases/access/${courseId}`
    )

    return {
      success: response.success,
      data: response.data,
      error: response.error,
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'ACCESS_CHECK_FAILED',
        message: error instanceof Error ? error.message : '檢查存取權限失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 批量檢查多個課程的購買狀態
 * 用於課程列表頁快速檢查
 */
export async function checkMultiplePurchases(
  courseIds: number[]
): Promise<Map<number, boolean>> {
  const purchaseMap = new Map<number, boolean>()

  try {
    // Fetch all purchases once
    const response = await getMyPurchases()

    if (response.success && response.data) {
      const purchasedCourseIds = new Set(response.data.map((p) => p.courseId))

      courseIds.forEach((courseId) => {
        purchaseMap.set(courseId, purchasedCourseIds.has(courseId))
      })
    }
  } catch (error) {
    console.error('Failed to check multiple purchases:', error)
    // Return empty map on error
  }

  return purchaseMap
}
