import Link from "next/link";
import {
  ArrowUpRight,
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
  MessageSquareQuote,
  Navigation,
  PawPrint,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  ThermometerSun,
  UserRound
} from "lucide-react";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { FAQSection } from "@/components/faq-section";
import { ProductMock } from "@/components/product-mock";
import { ScenarioCarousel } from "@/components/scenario-carousel";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

const signals = ["宠物档案", "常走路线", "天气时间", "POI 规则", "社区反馈", "Agent 解释"];

const logoCloudItems = [
  "宠物档案",
  "常走路线",
  "可信 POI",
  "天气风险",
  "社区热力",
  "走后反馈",
  "起终点隐藏",
  "宠物分身",
  "路线备选",
  "规则复查",
  "狗多时段",
  "阴影路线",
  "水碗验证",
  "避车路口",
  "高温降级",
  "聚合趋势",
  "轻量贡献",
  "隐私开关",
  "附近问答",
  "Agent 解释"
];

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

const projectCards = [
  {
    title: "今日出门建议",
    category: "Agent / 天气 / 宠物档案",
    summary: "打开首页先看到今天推荐走哪条熟悉路线、为什么推荐、有什么风险和降级备选。",
    accent: "bg-primary",
    className: "md:col-span-7 lg:col-span-9"
  },
  {
    title: "常走路线卡",
    category: "Routine / Route Memory",
    summary: "把阴影、狗密度、复杂路口、水源和最近反馈，沉淀成可复用路线对象。",
    accent: "bg-dusty-green",
    className: "md:col-span-7 lg:col-span-5"
  },
  {
    title: "POI 可信度",
    category: "Rules / Verification",
    summary: "可进入范围、体型限制、最近验证和争议状态，不再只是一枚“宠物友好”标签。",
    accent: "bg-sky-soft",
    className: "md:col-span-7 lg:col-span-7"
  },
  {
    title: "社区风险信号",
    category: "UGC / Privacy",
    summary: "狗多、施工、地面烫和临时禁入会短时影响推荐，同时不展示个人实时位置。",
    accent: "bg-dusty-red",
    className: "md:col-span-7 lg:col-span-7"
  },
  {
    title: "宠物分身解释",
    category: "Avatar / State",
    summary: "让分身把路线强度、遇狗概率和天气风险说清楚，而不是制造新的信息负担。",
    accent: "bg-natural-black",
    className: "md:col-span-7 lg:col-span-5"
  },
  {
    title: "走后两问反馈",
    category: "Feedback Loop",
    summary: "走完只问是否顺利、是否有新风险，把附近经验写回下一次出门。",
    accent: "bg-primary",
    className: "md:col-span-7 lg:col-span-9"
  }
];

const testimonials = [
  {
    name: "糯米主人",
    role: "反应犬家庭",
    quote: "以前热门草地看起来都不错，但糯米一遇到大狗就紧张。爪边会把狗密度和回家距离讲清楚，决定轻松很多。",
    badge: "避狗"
  },
  {
    name: "十一妈妈",
    role: "短鼻犬主人",
    quote: "高温天不再靠感觉硬走。它会提醒体感温度、地面热感和阴影比例，也会告诉我今天不适合临时拉长路线。",
    badge: "怕热"
  },
  {
    name: "新搬家用户",
    role: "新片区养狗人",
    quote: "我不是想刷攻略，只想知道今晚楼下哪条路靠谱。常走路线和最近验证这两个信息最有用。",
    badge: "新附近"
  },
  {
    name: "地图贡献者",
    role: "社区狗友",
    quote: "水碗、禁入、施工这些信息以前都散在群里。现在走完点两下，下一次别人就能少踩一次坑。",
    badge: "贡献"
  },
  {
    name: "老年犬家庭",
    role: "慢病犬主人",
    quote: "最好的路线不是最远，是短、平、阴影多、随时能回家。爪边终于按这个尺度推荐。",
    badge: "稳妥"
  }
];

const proofMetrics = [
  ["2-5 条", "P0 常走 routine"],
  ["1-2 问", "走后轻反馈"],
  ["0 实时", "不展示实时位置"],
  ["7 天内", "可信 POI 优先"]
];

const planCards = [
  {
    title: "日常出门",
    subtitle: "先做熟悉路线判断",
    price: "P0",
    badge: "主路径",
    theme: "light",
    features: ["宠物档案", "常走路线卡", "天气风险", "出门建议", "走后轻反馈", "POI 可信引用"]
  },
  {
    title: "附近探索",
    subtitle: "有目标时判断是否适合",
    price: "P1",
    badge: "下一阶段",
    theme: "dark",
    features: ["社区热力", "附近问答", "贡献信誉", "主动提醒", "互动分身", "片区运营"]
  },
  {
    title: "片区共建",
    subtitle: "让附近经验持续进入系统",
    price: "P2",
    badge: "平台化",
    theme: "light",
    features: ["商家确认", "服务接入", "硬件扩展", "多 Agent", "社区治理", "城市复制"]
  }
];

export function HeroSection() {
  return (
    <section className="h-[60vh] min-h-[620px] w-full p-2 md:h-screen md:min-h-[820px]">
      <div className="relative m-0 h-full w-full overflow-hidden rounded-3xl bg-black text-natural-white">
        <div className="template-grid absolute inset-x-0 top-0 h-1/2 opacity-20" />
        <div className="hero-starfield absolute bottom-10 left-1/2 z-0 h-40 w-[822px] max-w-[90vw] -translate-x-1/2 opacity-80" />
        <div className="hero-light-above absolute bottom-0 left-1/2 z-0 h-full w-full -translate-x-1/2 opacity-40" />
        <div className="hero-orbit absolute -bottom-[300px] left-1/2 z-0 h-[900px] w-[1500px] max-w-none -translate-x-1/2 md:-bottom-[360px] md:h-[1180px] md:w-[1900px]" />
        <Container className="relative z-10 flex h-full flex-col justify-between">
          <div className="pt-32 md:pt-42 lg:pt-72">
            <Link
              href="/features"
              className="flex w-fit rounded-full bg-neutral-900 p-1 shadow-lg shadow-black"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="rounded-full bg-neutral-950 px-2 py-1 text-[10px] sm:text-xs">
                  爪边 Agent
                </div>
                <div className="rounded-full pr-2 text-[10px] text-natural-white sm:text-xs">
                  今天附近哪种选择更稳
                </div>
              </div>
            </Link>
            <div className="mt-6 flex flex-col items-start gap-6 md:mt-10 lg:flex-row lg:gap-10">
              <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-tight text-natural-white sm:text-5xl md:text-6xl lg:text-7xl">
                普通地图给路线，爪边给适合这只宠物的附近判断。
              </h1>
              <div className="lg:max-w-md">
                <p className="text-balance text-sm font-medium leading-6 text-neutral-300 sm:text-base lg:text-lg">
                  出门前把宠物档案、常走路线、天气时间、POI 规则和社区反馈放在一起，给出建议、风险、理由和备选。
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button text="生成今日出门建议" href="#product" variant="light" />
                  <Button text="看看场景" href="/scenarios" variant="ghost" className="border-white/20 text-white hover:bg-white/10" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-20 sm:h-48 md:h-72">
            <p className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-natural-white/10 to-heading/0 bg-clip-text text-center text-[100px] font-semibold leading-none text-transparent sm:text-[6rem] md:-top-6 md:mt-10 md:text-[160px] lg:-top-18 lg:text-[300px]">
              爪边
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

export function LogoCloudSection() {
  return (
    <section className="w-full py-20">
      <Container className="max-w-7xl">
        <h2 className="text-center font-mono text-sm font-normal uppercase leading-4 text-muted-foreground">
          一次出门判断需要同时读懂这些信号
        </h2>
        <div className="mx-auto mt-12 flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-4 md:gap-x-12 md:gap-y-10">
          {logoCloudItems.slice(0, 15).map((item, index) => (
            <div
              key={item}
              className={cn(
                "relative flex h-9 min-w-30 items-center justify-center rounded-full border border-natural-black/10 bg-natural-white px-4 text-sm font-semibold text-heading shadow-card-md transition-transform duration-300 hover:-translate-y-0.5",
                index % 5 === 0 && "bg-natural-black text-natural-white",
                index % 5 === 2 && "bg-secondary",
                index % 5 === 3 && "bg-primary"
              )}
            >
              {item}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FeatureBento() {
  return (
    <section id="product" className="w-full">
      <Container className="flex flex-col gap-15 py-4">
        <SectionHeading
          title="懂它的附近判断"
          description="和参考模板一样，这里用 bento 卡片把核心产品能力拆开；每张卡都对应 P0 的一个真实判断环节。"
        />
        <div className="grid grid-cols-19 gap-3">
          <div className="relative col-span-19 min-h-[520px] overflow-hidden rounded-2xl bg-natural-black p-4 text-natural-white lg:col-span-6">
            <div className="hero-grid absolute inset-0 opacity-40" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <Sparkles className="size-7 text-primary" aria-hidden />
                <h3 className="mt-8 text-3xl font-semibold leading-10">出门 Agent</h3>
                <p className="mt-4 text-sm leading-7 text-white/66">
                  今天走哪条、为什么、哪里需要降级，都要在出门前几分钟说清楚。
                </p>
              </div>
              <ProductMock compact />
            </div>
          </div>
          <div className="col-span-19 grid grid-cols-1 gap-3 md:grid-cols-2 lg:col-span-13 lg:grid-cols-5">
            {pillars.slice(0, 4).map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <article
                  key={pillar.title}
                  className={cn(
                    "relative min-h-[314px] overflow-hidden rounded-2xl p-5 shadow-card-md",
                    index === 1 ? "bg-natural-black text-natural-white lg:col-span-3" : "bg-natural-white text-natural-black",
                    index === 0 && "lg:col-span-2",
                    index === 2 && "lg:col-span-3",
                    index === 3 && "lg:col-span-2"
                  )}
                >
                  <div className={cn("inline-flex size-11 items-center justify-center rounded-[8px]", pillar.tone)}>
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className={cn("mt-8 text-2xl font-semibold", index === 1 ? "text-natural-white" : "text-heading")}>
                    {pillar.title}
                  </h3>
                  <p className={cn("mt-3 text-sm leading-7", index === 1 ? "text-white/66" : "text-muted-foreground")}>
                    {pillar.body}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/14 to-transparent" />
                </article>
              );
            })}
            <article className="relative col-span-1 min-h-[314px] overflow-hidden rounded-2xl bg-natural-white p-5 shadow-card-md lg:col-span-5">
              <div className="grid h-full gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <MessageCircle className="size-6 text-dusty-green" aria-hidden />
                  <h3 className="mt-6 text-2xl font-semibold text-heading">走完只问两件事</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    不做内容流，不打断日常。把“顺利吗”和“有没有新风险”写回下一次推荐。
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {["顺利", "狗多", "新风险"].map((item) => (
                    <div key={item} className="rounded-xl bg-secondary p-4 text-center text-sm font-semibold text-heading">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
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

export function ProjectsShowcase() {
  return (
    <section className="w-full">
      <Container className="relative flex w-full flex-col gap-20 overflow-hidden pb-20 pt-40 md:pb-30 md:pt-65 lg:pb-30 lg:pt-80">
        <h2 className="template-page-word absolute top-20 text-[100px] font-medium leading-none opacity-25 md:top-30 md:text-[200px] lg:top-50 lg:text-[280px]">
          Scenarios
        </h2>
        <div className="z-10 grid grid-cols-14 gap-6 [--card-height:440px]">
          {projectCards.map((card) => (
            <Link
              key={card.title}
              href="/scenarios"
              className={cn(
                "group relative col-span-14 min-h-[440px] overflow-hidden rounded-3xl bg-natural-black text-natural-white shadow-card-lg",
                card.className
              )}
            >
              <div className={cn("absolute inset-0 opacity-85", card.accent)} />
              <div className="route-line absolute inset-0 opacity-55 mix-blend-multiply" />
              <div className="hero-grid absolute inset-0 opacity-25" />
              <div className="absolute inset-0 flex flex-col justify-between bg-natural-black/25 p-6 backdrop-blur-[1px] transition-colors duration-300 group-hover:bg-natural-black/45 md:p-8">
                <div className="space-y-3">
                  <div className="text-2xl font-semibold leading-8">{card.title}</div>
                  <p className="max-w-xl text-base font-medium leading-6 text-white/82">{card.summary}</p>
                </div>
                <div className="flex w-full items-end justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    查看场景
                    <ArrowUpRight className="size-4" aria-hidden />
                  </div>
                  <span className="max-w-48 text-right text-sm font-medium text-white/76">{card.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full">
      <Container className="relative flex flex-col gap-15 overflow-hidden py-20 md:py-30 lg:gap-20">
        <div className="flex flex-col items-center justify-between gap-8 md:items-start lg:flex-row lg:items-center">
          <SectionHeading title="看看狗主怎么说" description="参考模板的横向 testimonial 区块，在这里改成真实目标用户的判断语言。" />
          <Button text="加入内测" href="#waitlist" variant="dark" />
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max gap-6">
            {[...testimonials, ...testimonials].map((item, index) => (
              <article key={`${item.name}-${index}`} className="w-[360px] shrink-0 rounded-3xl bg-natural-white p-6 shadow-card-md md:w-[460px]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-natural-black">
                      <UserRound className="size-5" aria-hidden />
                    </div>
                    <div>
                      <div className="font-semibold text-heading">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.role}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-dusty-green">{item.badge}</span>
                </div>
                <p className="mt-8 text-base font-medium leading-7 text-heading">“{item.quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function BentoTwoSection() {
  return (
    <section className="w-full">
      <Container className="flex flex-col gap-15 py-20 md:py-30">
        <SectionHeading title="让附近经验形成飞轮" description="对应参考模板的第二组 bento：左侧 CTA 卡，右侧指标、横向滚动、引用和底部 marquee。" />
        <div className="flex min-h-140 w-full flex-col-reverse gap-3 lg:grid lg:grid-cols-3">
          <div className="relative h-140 overflow-hidden rounded-2xl bg-natural-black p-6 text-natural-white lg:h-full">
            <div className="hero-grid absolute inset-0 opacity-30" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <Navigation className="size-7 text-primary" aria-hidden />
                <h3 className="mt-8 text-4xl font-semibold leading-tight">每一次出门，都把附近记得更准。</h3>
                <p className="mt-5 text-sm leading-7 text-white/66">出门前判断，走完后反馈，下一次推荐更稳。</p>
              </div>
              <Button text="生成今日建议" href="#product" variant="light" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:col-span-2 lg:grid-cols-2 lg:grid-rows-4">
            <div className="row-span-1 rounded-2xl bg-natural-white p-6 shadow-card-md md:row-span-3">
              <div className="grid h-full content-between gap-6">
                <div>
                  <Radar className="size-6 text-dusty-green" aria-hidden />
                  <h3 className="mt-6 text-2xl font-semibold text-heading">P0 先看这些信号</h3>
                </div>
                <div className="grid gap-4">
                  {proofMetrics.map(([value, label]) => (
                    <div key={label} className="flex items-end justify-between border-b border-natural-black/10 pb-3">
                      <span className="text-3xl font-semibold text-heading">{value}</span>
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row-span-1 overflow-hidden rounded-2xl bg-natural-white p-5 shadow-card-md">
              <div className="marquee-track flex w-max gap-3">
                {[...signals, ...signals].map((item, index) => (
                  <span key={`${item}-${index}`} className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-heading">{item}</span>
                ))}
              </div>
            </div>
            <div className="row-span-1 rounded-2xl bg-natural-white p-6 shadow-card-md md:row-span-2">
              <MessageSquareQuote className="size-6 text-dusty-green" aria-hidden />
              <p className="mt-8 text-xl font-semibold leading-8 text-heading">“用户出门前需要判断，不是再刷十分钟经验帖。”</p>
              <p className="mt-4 text-sm text-muted-foreground">PRD 核心约束</p>
            </div>
            <div className="col-span-1 min-h-20 overflow-hidden rounded-2xl bg-natural-white p-5 shadow-card-md md:col-span-2">
              <div className="marquee-track flex w-max gap-3">
                {[...logoCloudItems, ...logoCloudItems].map((item, index) => (
                  <span key={`${item}-${index}`} className="rounded-full border border-natural-black/10 px-4 py-2 text-sm font-semibold text-muted-foreground">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="w-full">
      <Container className="flex flex-col gap-20 py-20 md:py-30">
        <div className="flex w-full flex-col justify-between gap-4 lg:flex-row">
          <SectionHeading title="路线图不是价格表，但版式完整保留" />
          <p className="max-w-xl text-base font-medium leading-7 text-muted-foreground">
            参考模板的 pricing 区块在这里改为 P0/P1/P2 路线图，避免硬塞商业定价。
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {planCards.map((plan) => (
            <article
              key={plan.title}
              className={cn(
                "relative flex min-h-[520px] flex-col justify-between overflow-hidden rounded-3xl p-3 shadow-card-lg",
                plan.theme === "dark" ? "bg-natural-black text-natural-white" : "bg-natural-white text-natural-black"
              )}
            >
              {plan.theme === "dark" ? <div className="absolute -left-20 -top-20 size-48 rounded-full bg-white/20 blur-3xl" /> : null}
              <div className={cn("relative z-10 rounded-2xl p-6", plan.theme === "dark" ? "bg-white/10" : "bg-secondary")}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold">{plan.title}</span>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-natural-black">{plan.badge}</span>
                </div>
                <div className="mt-8 text-5xl font-semibold">{plan.price}</div>
                <p className="mt-3 text-lg text-muted-foreground">{plan.subtitle}</p>
                <Button className="mt-8" text="查看详情" href="/features" variant={plan.theme === "dark" ? "light" : "dark"} />
              </div>
              <div className="relative z-10 grid gap-4 p-5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <span className="size-2.5 rounded-full bg-muted-foreground/50" />
                    {feature}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="relative w-full overflow-hidden bg-natural-black text-natural-white">
      <div className="hero-grid absolute inset-0 opacity-20" />
      <Container className="relative z-10 flex w-full flex-col gap-20 pb-30 pt-20">
        <div className="text-6xl font-medium leading-tight">附近的重新出现</div>
        <div className="grid w-full grid-cols-1 justify-between gap-16 lg:grid-cols-5">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-secondary lg:col-span-2">
            <div className="route-line absolute inset-0 opacity-80" />
            <div className="absolute inset-6 rounded-3xl border border-natural-black/10 bg-natural-white/72 p-5 text-natural-black shadow-card-lg backdrop-blur">
              <ProductMock compact />
            </div>
          </div>
          <div className="flex h-full w-full flex-col justify-between gap-15 lg:col-span-3">
            <div className="flex flex-col gap-6 text-lg font-medium leading-7">
              <p>
                宠物会把人从屏幕里拉出来。今天热不热、地面烫不烫、哪条路有阴影、哪家店门口还有水碗，这些很小的问题决定了一次出门是放松还是紧张。
              </p>
              <p className="text-white/70">
                爪边把这些附近经验放回一次具体出门里：这只宠物、这个时间、这条熟路、这个地点，是否真的适合。
              </p>
            </div>
            <div className="overflow-hidden">
              <div className="marquee-track flex w-max gap-3">
                {[...testimonials.slice(0, 3), ...testimonials.slice(0, 3)].map((item, index) => (
                  <div key={`${item.name}-about-${index}`} className="flex min-w-72 items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-natural-black">
                      <Star className="size-4" aria-hidden />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-white/50">{item.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FeedbacksSection() {
  return (
    <section className="w-full overflow-hidden">
      <Container className="flex flex-col gap-15 py-20 md:py-30">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <SectionHeading title="把经验写回地图" description="对应参考模板的第二个反馈轮播，强调贡献、纠错和最近验证。" />
          <Button text="标记一个真实地点" href="/scenarios" variant="dark" />
        </div>
        <div className="marquee-track flex w-max gap-6">
          {[
            ["巷口水碗仍可用", "2 天前确认，建议停留不超过 5 分钟。"],
            ["北门草地傍晚狗多", "反应犬今天不作为默认推荐。"],
            ["露台仅限小型犬", "雨天体验不稳定，需要二次确认。"],
            ["施工路段已绕开", "短时风险信号 3 小时后自动衰减。"],
            ["电动车路口需牵紧", "常走路线卡已降低复杂路口权重。"]
          ].concat([
            ["巷口水碗仍可用", "2 天前确认，建议停留不超过 5 分钟。"],
            ["北门草地傍晚狗多", "反应犬今天不作为默认推荐。"],
            ["露台仅限小型犬", "雨天体验不稳定，需要二次确认。"]
          ]).map(([title, body], index) => (
            <article key={`${title}-${index}`} className="w-[380px] shrink-0 rounded-3xl bg-natural-white p-6 shadow-card-md">
              <Store className="size-6 text-dusty-green" aria-hidden />
              <h3 className="mt-8 text-2xl font-semibold text-heading">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{body}</p>
            </article>
          ))}
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
