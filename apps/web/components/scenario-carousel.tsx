"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const slides = [
  {
    label: "高温傍晚",
    title: "体感 32C，不默认拉长路线",
    body: "怕热的小型犬优先走阴影多、可快速回家的短线，草地和露台地点只作为备选。"
  },
  {
    label: "反应犬避狗",
    title: "热门路线不一定是好路线",
    body: "社区狗密度高的片区会降权，系统把安静路线、复杂路口和回家距离一起解释。"
  },
  {
    label: "有目标出行",
    title: "想去咖啡店，也先看规则可信度",
    body: "可进入范围、是否仅露台、最近验证时间和雨天体验，会先进入判断再推荐。"
  }
];

export function ScenarioCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, []);

  const slide = slides[active];

  return (
    <div className="rounded-[8px] bg-natural-black p-5 text-natural-white shadow-card-lg">
      <div className="min-h-48 rounded-[8px] border border-white/10 bg-white/5 p-6 soft-noise">
        <div className="font-mono text-xs font-semibold uppercase text-primary">{slide.label}</div>
        <h3 className="mt-6 text-2xl font-semibold leading-8">{slide.title}</h3>
        <p className="mt-4 text-sm leading-7 text-white/70">{slide.body}</p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-2">
          {slides.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-label={`查看${item.label}`}
              onClick={() => setActive(index)}
              className={cn(
                "size-2 rounded-full transition-colors",
                active === index ? "bg-primary" : "bg-white/26"
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="上一条场景"
            onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)}
            className="inline-flex size-9 items-center justify-center rounded-[8px] border border-white/15 text-white hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="下一条场景"
            onClick={() => setActive((current) => (current + 1) % slides.length)}
            className="inline-flex size-9 items-center justify-center rounded-[8px] border border-white/15 text-white hover:bg-white/10"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
