/**
 * 獎勵任務頁面
 * 路由: /journeys/[journeySlug]/missions
 * 狀態: 建置中
 */

import UnderConstruction from '@/components/ui/UnderConstruction'

export default function MissionsPage({ params }: { params: { journeySlug: string } }) {
  return (
    <UnderConstruction
      title="獎勵任務"
      description="獎勵任務功能正在開發中！完成後您將可以透過此頁面查看並領取各種學習獎勵，敬請期待。"
      backUrl={`/journeys/${params.journeySlug}`}
      backLabel="返回課程"
    />
  )
}
