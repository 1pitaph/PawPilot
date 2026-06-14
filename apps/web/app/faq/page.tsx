import { FAQSection } from "@/components/faq-section";
import { FinalCTA, PageHero } from "@/components/marketing-sections";

export const metadata = {
  title: "FAQ / 爪边",
  description: "爪边宣传站常见问题。"
};

export default function FAQPage() {
  return (
    <main>
      <PageHero
        kicker="FAQ"
        title="关于爪边，先把边界说清楚"
        description="这一页回答产品定位、P0 范围、隐私、POI 可信度和当前原型状态。"
      />
      <FAQSection />
      <FinalCTA />
    </main>
  );
}
