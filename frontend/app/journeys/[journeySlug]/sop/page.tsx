/**
 * SOP 寶典頁面
 * 路由: /journeys/[journeySlug]/sop
 * 狀態: 建置中
 */

import UnderConstruction from '@/components/ui/UnderConstruction'

export default function SopPage({ params }: { params: { journeySlug: string } }) {
  return (
    <UnderConstruction
      title="SOP 寶典"
      description="SOP 寶典功能正在開發中！完成後您將可以查看完整的標準作業流程與最佳實踐指南，敬請期待。"
      backUrl={`/journeys/${params.journeySlug}`}
      backLabel="返回課程"
    />
  )
}
