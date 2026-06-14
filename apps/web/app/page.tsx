import {
  AboutSection,
  BentoTwoSection,
  ComparisonSection,
  FeatureBento,
  FeedbacksSection,
  HeroSection,
  HomeFAQ,
  LogoCloudSection,
  PricingSection,
  ProjectsShowcase,
  TestimonialsSection
} from "@/components/marketing-sections";

export default function HomePage() {
  return (
    <main className="flex w-full flex-col">
      <HeroSection />
      <LogoCloudSection />
      <FeatureBento />
      <ProjectsShowcase />
      <TestimonialsSection />
      <BentoTwoSection />
      <ComparisonSection />
      <PricingSection />
      <AboutSection />
      <FeedbacksSection />
      <HomeFAQ />
    </main>
  );
}
