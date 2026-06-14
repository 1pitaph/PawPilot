"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

export const faqs = [
  {
    question: "爪边和普通地图有什么区别？",
    answer:
      "普通地图更擅长告诉你怎么走。爪边会把宠物档案、常走路线、天气时间、地点规则和社区反馈放在一起，判断这一次出门是否适合这只宠物。"
  },
  {
    question: "P0 版本会覆盖所有宠物吗？",
    answer:
      "第一版以城市日常遛狗为主，尤其关注怕热、怕狗、怕车、老年犬、幼犬和新手养狗场景。数据结构会保留未来扩展到猫和其他宠物的空间。"
  },
  {
    question: "社区贡献会暴露我的路线吗？",
    answer:
      "不会默认公开个人路线。社区热力必须 opt-in，并使用聚合格网、延迟展示、起终点隐藏和 k 匿名，不展示实时位置或单条原始轨迹。"
  },
  {
    question: "POI 的宠物友好信息怎么判断可信？",
    answer:
      "地点会显示可进入范围、体型限制、牵引要求、最近验证、证据来源和争议状态。低置信信息可以被引用，但必须明确标注不确定。"
  },
  {
    question: "出门 Agent 会替代主人的判断吗？",
    answer:
      "不会。爪边给出建议、理由、风险和备选，不承诺绝对安全。主人仍然需要根据现场情况和宠物状态做最终决定。"
  },
  {
    question: "这个宣传站接入真实地图或后端了吗？",
    answer:
      "没有。当前是基于 PRD 和共享 mock 数据实现的宣传站原型，用于展示产品定位、关键页面和交互节奏。"
  }
];

export function FAQSection({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(0);
  const visibleFaqs = compact ? faqs.slice(0, 4) : faqs;

  return (
    <section className="w-full">
      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          kicker="FAQ"
          title="出门前会问的问题，先回答清楚"
          description="这一版重点服务 P0：城市日常遛狗、附近判断、可信地点和隐私边界。"
        />
        <div className="divide-y divide-natural-black/12 rounded-[8px] bg-natural-white shadow-card-md">
          {visibleFaqs.map((faq, index) => {
            const active = open === index;

            return (
              <div key={faq.question} className="p-5 md:p-6">
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={active}
                >
                  <span className="text-base font-semibold leading-6 text-heading">{faq.question}</span>
                  <ChevronDown
                    className={cn("size-5 shrink-0 text-muted-foreground transition-transform", active && "rotate-180")}
                    aria-hidden
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pt-4 text-sm leading-7 text-muted-foreground md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
