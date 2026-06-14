import { FinalCTA, PageHero, PrivacyDetail, PrivacyPreview } from "@/components/marketing-sections";

export const metadata = {
  title: "隐私 / 爪边",
  description: "路线记录开关、社区贡献 opt-in、起终点隐藏、聚合热力和无实时位置暴露。"
};

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        kicker="Privacy"
        title="宠物路线是敏感数据，必须先设计边界"
        description="爪边需要社区信号，但不应该用公开个人轨迹换便利。隐私规则会直接影响产品推荐和展示方式。"
      />
      <PrivacyDetail />
      <PrivacyPreview />
      <FinalCTA />
    </main>
  );
}
