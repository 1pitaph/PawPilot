import { FeatureDetailGrid, FinalCTA, PageHero, SignalStrip, TrustMetrics } from "@/components/marketing-sections";

export const metadata = {
  title: "功能 / 爪边",
  description: "宠物档案、常走路线、出门 Agent、POI 可信度、走后反馈和宠物分身。"
};

export default function FeaturesPage() {
  return (
    <main>
      <PageHero
        kicker="Features"
        title="功能不是堆地图点，而是让判断更稳"
        description="爪边 P0 把宠物差异、路线习惯、天气风险、地点规则和社区信号合在一起，出门前给一个可解释、可反馈的建议。"
      />
      <FeatureDetailGrid />
      <SignalStrip />
      <TrustMetrics />
      <FinalCTA />
    </main>
  );
}
