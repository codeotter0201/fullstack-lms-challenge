/**
 * 挑戰地圖頁面
 * 路由: /journeys/[journeySlug]/roadmap
 * 狀態: 建置中
 */

import UnderConstruction from '@/components/ui/UnderConstruction'

export default function RoadmapPage({ params }: { params: { journeySlug: string } }) {
  return (
    <UnderConstruction
      title="挑戰地圖"
      description="挑戰地圖功能正在開發中！完成後您將可以透過視覺化地圖查看完整的學習路徑與進度，敬請期待。"
      backUrl={`/journeys/${params.journeySlug}`}
      backLabel="返回課程"
    />
  )
}
