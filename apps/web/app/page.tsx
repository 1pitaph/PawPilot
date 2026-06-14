import {
  ComparisonSection,
  FeatureBento,
  FinalCTA,
  HeroSection,
  HomeFAQ,
  PrivacyPreview,
  ScenarioPreview,
  SignalStrip,
  TrustMetrics
} from "@/components/marketing-sections";

export default function HomePage() {
  return (
    <main className="flex w-full flex-col">
      <HeroSection />
      <SignalStrip />
      <FeatureBento />
      <ScenarioPreview />
      <ComparisonSection />
      <TrustMetrics />
      <PrivacyPreview />
      <HomeFAQ />
      <FinalCTA />
    </main>
  );
}
