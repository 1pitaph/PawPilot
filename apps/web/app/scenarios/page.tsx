import { FinalCTA, PageHero, ScenarioDetailGrid, ScenarioPreview } from "@/components/marketing-sections";

export const metadata = {
  title: "场景 / 爪边",
  description: "日常遛狗、高温天气、反应犬避狗、有目标附近出行和地图贡献。"
};

export default function ScenariosPage() {
  return (
    <main>
      <PageHero
        kicker="Scenarios"
        title="每一种宠物，都会让附近变得不一样"
        description="同一家咖啡店、同一条路、同一个傍晚，对小型犬、反应犬、老年犬和新手主人来说，都可能是完全不同的体验。"
      />
      <ScenarioDetailGrid />
      <ScenarioPreview />
      <FinalCTA />
    </main>
  );
}
