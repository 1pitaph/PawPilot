import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";

const groups = [
  {
    title: "产品",
    links: [
      { label: "功能", href: "/features" },
      { label: "场景", href: "/scenarios" },
      { label: "隐私", href: "/privacy" }
    ]
  },
  {
    title: "资源",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "能力说明", href: "/features" },
      { label: "使用场景", href: "/scenarios" }
    ]
  }
];

export function Footer() {
  return (
    <footer id="waitlist" className="relative overflow-hidden bg-natural-black text-natural-white">
      <Container className="flex flex-col gap-16 py-16 md:py-24">
        <div className="grid gap-8 border-b border-white/10 pb-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex max-w-3xl flex-col gap-6">
            <span className="font-mono text-xs font-semibold uppercase text-primary">Private Beta</span>
            <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
              让每一次出门，都把附近记得更准。
            </h2>
            <p className="text-base leading-7 text-white/68 md:text-lg">
              第一版面向城市日常遛狗场景：宠物档案、常走路线、天气风险、POI 可信度和社区反馈，会一起变成一句可以采纳的出门建议。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button text="加入内测名单" href="mailto:hello@zhaobian.local?subject=加入爪边内测" variant="light" />
              <Button text="查看隐私边界" href="/privacy" variant="ghost" className="border-white/20 text-white hover:bg-white/10" />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-10 rounded-[8px] border border-white/12 bg-white/5 p-6">
            <Logo className="text-natural-white" />
            <div className="space-y-4">
              <p className="text-sm leading-6 text-white/66">
                爪边不是另一个地点列表，而是一个把宠物个体差异放进附近判断里的出门 Agent。
              </p>
              <Link href="mailto:hello@zhaobian.local" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Mail className="size-4" aria-hidden />
                hello@zhaobian.local
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_0.7fr]">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-white/50">2026 爪边 / Pet Mobility Agent</span>
            <span className="text-sm text-white/50">宣传站原型基于 PRD 内容生成，暂不接入真实地图或后端。</span>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-white/52">{group.title}</h3>
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href} className="inline-flex items-center gap-1 text-sm font-medium text-white hover:text-primary">
                    {link.label}
                    <ArrowUpRight className="size-3" aria-hidden />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
