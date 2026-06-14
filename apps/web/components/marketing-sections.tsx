import Link from "next/link";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  EyeOff,
  FileCheck2,
  Flag,
  Footprints,
  Map,
  MapPinned,
  MessageCircle,
  PawPrint,
  Route,
  ShieldCheck,
  Sparkles,
  ThermometerSun
} from "lucide-react";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { FAQSection } from "@/components/faq-section";
import { ProductMock } from "@/components/product-mock";
import { ScenarioCarousel } from "@/components/scenario-carousel";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

const signals = ["宠物档案", "常走路线", "天气时间", "POI 规则", "社区反馈", "Agent 解释"];

const pillars = [
  {
    title: "宠物档案",
    body: "体型、年龄、怕热、怕狗、怕车、可走时长和社交偏好，会直接影响推荐排序。",
    icon: PawPrint,
    tone: "bg-primary/24 text-natural-black"
  },
  {
    title: "常走路线",
    body: "把每天反复走过的路线沉淀成可复用对象：短线、安静线、社交线、雨后慎走线。",
    icon: Route,
    tone: "bg-dusty-green/14 text-dusty-green"
  },
  {
    title: "出门 Agent",
    body: "出门前给一句能采纳的判断，同时说明天气、宠物状态、路线风险和备选方案。",
    icon: Sparkles,
    tone: "bg-sky-soft/22 text-[#2d6772]"
  },
  {
    title: "POI 可信度",
    body: "宠物友好不只是标签。可进入范围、体型限制、水碗、最近验证和争议状态都要显示。",
    icon: FileCheck2,
    tone: "bg-dusty-red/12 text-dusty-red"
  },
  {
    title: "走后轻反馈",
    body: "走完只问 1-2 个问题，把狗多、顺利、新风险和规则变化写回下一次推荐。",
    icon: MessageCircle,
    tone: "bg-natural-black/8 text-natural-black"
  },
  {
    title: "宠物分身",
    body: "把路线强度、遇狗概率和天气风险说成人能听懂的话，而不是制造新的信息负担。",
    icon: BellRing,
    tone: "bg-secondary text-dusty-green"
  }
];

const scenarios = [
  {
    title: "无目标日常出门",
    body: "打开就看今天哪条常走路线最稳，不需要重新搜索附近。",
    icon: Footprints
  },
  {
    title: "高风险天气",
    body: "高温、雨后、地面热感和空气质量会触发缩短、改时段或拒绝建议。",
    icon: ThermometerSun
  },
  {
    title: "反应犬避狗",
    body: "狗密度、复杂路口、电动车多和儿童噪声会影响路线优先级。",
    icon: EyeOff
  },
  {
    title: "有目标附近出行",
    body: "想去咖啡店、公园或宠物店时，先判断这只宠物是否真的适合。",
    icon: MapPinned
  }
];

const comparison = [
  ["问题入口", "找地点、找路线", "判断这只宠物此刻怎么出门更稳"],
  ["推荐依据", "距离、评分、热门程度", "宠物档案、天气、常走路线、POI 规则、社区反馈"],
  ["地点信息", "宠物友好 yes/no", "室内/露台/体型限制/水碗/最近验证/争议状态"],
  ["社区信号", "评论和内容流", "结构化风险、最近验证、脱敏热力"],
  ["结果形态", "路线或列表", "建议、理由、风险、备选和走后反馈"]
];

const privacyItems = [
  {
    title: "路线记录开关",
    body: "个人路线默认服务于自己的回放和推荐，不自动进入社区层。",
    icon: ShieldCheck
  },
  {
    title: "社区贡献 opt-in",
    body: "贡献水碗、狗多、施工或规则变化时，用户明确选择是否参与。",
    icon: CheckCircle2
  },
  {
    title: "起终点隐藏",
    body: "社区热力隐藏住址附近区域，避免暴露日常作息和回家路线。",
    icon: EyeOff
  },
  {
    title: "聚合与延迟",
    body: "趋势按格网和时间窗口展示，不显示个人实时位置或单条轨迹。",
    icon: Clock3
  }
];

export function HeroSection() {
  return (
    <section className="h-[calc(100vh-16px)] min-h-[760px] w-full p-2">
      <div className="relative h-full overflow-hidden rounded-[24px] bg-natural-black text-natural-white">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#243c34] to-transparent opacity-70" />
        <div className="absolute right-0 top-24 hidden w-[48%] max-w-xl lg:block">
          <ProductMock compact />
        </div>
        <Container className="relative z-10 flex h-full flex-col justify-between">
          <div className="max-w-4xl pt-32 md:pt-44 lg:pt-56">
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-white/14 bg-white/8 px-3 py-2 text-xs font-semibold text-white/80">
              <Sparkles className="size-4 text-primary" aria-hidden />
              宠物友好地图 Agent
            </div>
            <h1 className="mt-8 text-6xl font-semibold leading-none md:text-8xl">
              爪边
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-white/76 md:text-2xl">
              懂你家宠物的附近地图。普通地图给路线，爪边给适合这只宠物的附近判断。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button text="生成今日出门建议" href="#product" variant="light" />
              <Button text="看看核心功能" href="/features" variant="ghost" className="border-white/20 text-white hover:bg-white/10" />
            </div>
          </div>
          <div className="relative pb-8 lg:hidden">
            <ProductMock compact />
          </div>
          <div className="hidden pb-8 lg:block">
            <p className="max-w-2xl text-sm leading-6 text-white/50">
              宠物档案 + 常走路线 + 天气时间 + POI 规则 + 社区反馈 + Agent 解释 = 一次更稳的附近判断。
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}

export function SignalStrip() {
  const loop = [...signals, ...signals];

  return (
    <section className="overflow-hidden py-12">
      <Container>
        <p className="text-center font-mono text-xs font-semibold uppercase text-muted-foreground">
          Signals for one walk
        </p>
        <div className="mt-8 overflow-hidden rounded-[8px] border border-natural-black/10 bg-natural-white py-4">
          <div className="marquee-track flex w-max gap-3">
            {loop.map((signal, index) => (
              <span
                key={`${signal}-${index}`}
                className="mx-2 inline-flex items-center gap-2 rounded-[8px] bg-secondary px-4 py-2 text-sm font-semibold text-heading"
              >
                <span className="size-2 rounded-full bg-primary" />
                {signal}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FeatureBento() {
  return (
    <section id="product" className="w-full">
      <Container className="flex flex-col gap-12 py-16 md:py-24">
        <SectionHeading
          kicker="Product"
          title="把分散的附近经验，合成一句能采纳的建议"
          description="爪边不追求更大的地点目录，而是把每一次出门前真正影响判断的信号放在一起。"
        />
        <div className="grid gap-3 lg:grid-cols-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className={cn(
                  "rounded-[8px] bg-natural-white p-6 shadow-card-md",
                  index === 0 || index === 2 ? "lg:col-span-3" : "lg:col-span-2"
                )}
              >
                <div className={cn("inline-flex size-11 items-center justify-center rounded-[8px]", pillar.tone)}>
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-heading">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function ScenarioPreview() {
  return (
    <section className="w-full bg-secondary/60">
      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-8">
          <SectionHeading
            kicker="Scenarios"
            title="宠物把城市变成另一张地图"
            description="平时只是步行 8 分钟的路，遛狗时会被拆成风、声音、地面、牵引绳和宠物反应。"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <Link
                  href="/scenarios"
                  key={scenario.title}
                  className="rounded-[8px] bg-natural-white p-5 shadow-card-md transition-transform hover:-translate-y-0.5"
                >
                  <Icon className="size-5 text-dusty-green" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold text-heading">{scenario.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{scenario.body}</p>
                </Link>
              );
            })}
          </div>
        </div>
        <ScenarioCarousel />
      </Container>
    </section>
  );
}

export function ComparisonSection() {
  return (
    <section className="w-full">
      <Container className="flex flex-col gap-12 py-16 md:py-24">
        <SectionHeading
          kicker="Difference"
          title="不是“哪里能带宠”，而是“此刻适合吗”"
          description="爪边借鉴地图、运动路线和 UGC 机制，但评价尺度换成宠物适配和日常稳定。"
        />
        <div className="overflow-hidden rounded-[8px] border border-natural-black/10 bg-natural-white shadow-card-md">
          <div className="grid grid-cols-3 bg-natural-black px-5 py-4 text-sm font-semibold text-natural-white">
            <span>维度</span>
            <span>普通地图 / 目录</span>
            <span>爪边</span>
          </div>
          {comparison.map(([dimension, generic, zhaobian]) => (
            <div key={dimension} className="grid gap-4 border-t border-natural-black/10 px-5 py-5 text-sm md:grid-cols-3">
              <span className="font-semibold text-heading">{dimension}</span>
              <span className="text-muted-foreground">{generic}</span>
              <span className="font-medium text-natural-black">{zhaobian}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function PrivacyPreview() {
  return (
    <section className="w-full bg-natural-black text-natural-white">
      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading
          kicker="Privacy"
          title="社区信号可以有用，但不能暴露个人"
          description="宠物路线会暴露住址、作息和宠物身份。爪边把隐私边界作为推荐系统的一部分，而不是上线后的补丁。"
          className="text-natural-white [&_h2]:text-natural-white [&_p]:text-white/66"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {privacyItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[8px] border border-white/10 bg-white/6 p-5">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/66">{item.body}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function HomeFAQ() {
  return <FAQSection compact />;
}

export function FinalCTA() {
  return (
    <section className="w-full">
      <Container className="py-16 md:py-24">
        <div className="rounded-[8px] bg-primary p-8 text-natural-black md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="font-mono text-xs font-semibold uppercase">P0 Loop</span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                出门前一句建议，走完后两个反馈。
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              <p className="text-base leading-7">
                如果 P0 能让用户在出门前得到可信、具体、能反馈的建议，爪边的价值就会超过宠物友好地点列表。
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button text="加入内测" href="#waitlist" variant="dark" />
                <Button text="阅读 FAQ" href="/faq" variant="ghost" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function PageHero({
  kicker,
  title,
  description
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-natural-black pt-28 text-natural-white">
      <Container className="pb-16 pt-10 md:pb-24 md:pt-20">
        <div className="max-w-4xl">
          <span className="font-mono text-xs font-semibold uppercase text-primary">{kicker}</span>
          <h1 className="mt-6 text-5xl font-semibold leading-tight md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68 md:text-xl">{description}</p>
        </div>
      </Container>
    </section>
  );
}

export function FeatureDetailGrid() {
  return (
    <section className="w-full">
      <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <ProductMock />
        <div className="grid gap-3 sm:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="rounded-[8px] bg-natural-white p-5 shadow-card-md">
                <Icon className="size-5 text-dusty-green" aria-hidden />
                <h2 className="mt-5 text-xl font-semibold text-heading">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function ScenarioDetailGrid() {
  const detail = [
    ["日常路线选择", "无目标出门时，优先从熟悉路线中选择今天最稳的一条。"],
    ["高温或雨后", "高风险天气下，系统可以建议缩短、改时段、换路线或不建议出门。"],
    ["反应犬避狗", "狗多时段、复杂路口和噪声会改变排序，热门不默认等于推荐。"],
    ["有目标附近出行", "POI 进入推荐前先看规则、路线风险和宠物适配度。"],
    ["地图贡献", "用户发现水碗、禁入、施工或狗多后，用结构化轻反馈写回系统。"]
  ];

  return (
    <section className="w-full">
      <Container className="grid gap-3 py-16 md:grid-cols-2 md:py-24">
        {detail.map(([title, body], index) => (
          <article key={title} className={cn("rounded-[8px] p-6 shadow-card-md", index % 2 ? "bg-secondary" : "bg-natural-white")}>
            <Flag className="size-5 text-dusty-green" aria-hidden />
            <h2 className="mt-6 text-2xl font-semibold text-heading">{title}</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">{body}</p>
          </article>
        ))}
      </Container>
    </section>
  );
}

export function PrivacyDetail() {
  const boundaries = [
    "不展示个人实时位置",
    "不展示单条原始轨迹",
    "不公开起终点附近区域",
    "不把敏感风险细节做成可搜索的人或住址线索"
  ];

  return (
    <section className="w-full">
      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[8px] bg-natural-black p-6 text-natural-white">
          <Map className="size-6 text-primary" aria-hidden />
          <h2 className="mt-8 text-3xl font-semibold">热力只回答趋势，不回答“谁在这里”。</h2>
          <p className="mt-4 text-sm leading-7 text-white/66">
            社区层只使用延迟、聚合、匿名后的信号，用来判断狗多、安静、风险和友好地点趋势。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {privacyItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-[8px] bg-natural-white p-5 shadow-card-md">
                <Icon className="size-5 text-dusty-green" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
        <div className="lg:col-span-2">
          <div className="grid gap-3 rounded-[8px] border border-natural-black/10 bg-natural-white p-5 shadow-card-md md:grid-cols-4">
            {boundaries.map((boundary) => (
              <div key={boundary} className="flex items-center gap-3 rounded-[8px] bg-secondary px-4 py-3 text-sm font-semibold text-heading">
                <ShieldCheck className="size-4 text-dusty-green" aria-hidden />
                {boundary}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function TrustMetrics() {
  return (
    <section className="w-full">
      <Container className="grid gap-3 py-16 md:grid-cols-3 md:py-24">
        {[
          ["2-5 条", "P0 先沉淀用户常走 routine"],
          ["1-2 问", "走后轻反馈，不打断日常"],
          ["0 实时", "不展示附近狗主实时位置"]
        ].map(([value, label]) => (
          <div key={label} className="rounded-[8px] bg-natural-white p-6 shadow-card-md">
            <div className="text-4xl font-semibold text-heading">{value}</div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
