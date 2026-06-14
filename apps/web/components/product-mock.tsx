import {
  buildDepartureAdvice,
  demoPet,
  demoPois,
  demoRoutes,
  demoWeather,
  type Poi
} from "@pets/shared";
import { AlertTriangle, CheckCircle2, MapPin, ShieldCheck, ThermometerSun } from "lucide-react";

import { cn } from "@/lib/utils";

const advice = buildDepartureAdvice({
  pet: demoPet,
  routes: demoRoutes,
  pois: demoPois,
  weather: demoWeather
});

function TrustBadge({ trust }: { trust: Poi["trust"] }) {
  const verified = trust === "verified";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-semibold",
        verified ? "bg-dusty-green/12 text-dusty-green" : "bg-dusty-red/12 text-dusty-red"
      )}
    >
      {verified ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}
      {verified ? "已验证" : "待复查"}
    </span>
  );
}

export function ProductMock({ compact = false }: { compact?: boolean }) {
  const route = advice.recommendedRoute;

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-sm rounded-[32px] border border-white/18 bg-[#10100c] p-3 shadow-card-lg",
        compact ? "max-w-xs" : "lg:max-w-md"
      )}
      aria-label="爪边产品界面预览"
    >
      <div className="overflow-hidden rounded-[24px] bg-offwhite">
        <div className="flex items-center justify-between bg-natural-black px-5 py-4 text-natural-white">
          <div>
            <div className="font-mono text-[11px] uppercase text-primary">出门 Agent</div>
            <div className="mt-1 text-lg font-semibold">今天怎么遛更稳</div>
          </div>
          <div className="flex size-12 items-center justify-center rounded-[8px] bg-primary text-sm font-bold text-natural-black">
            {demoPet.name.slice(0, 1)}
          </div>
        </div>

        <div className="relative h-48 overflow-hidden bg-[#dfe8dc] route-line">
          <div className="hero-grid absolute inset-0 opacity-45" />
          <div className="absolute left-6 top-6 rounded-[8px] bg-natural-white px-3 py-2 shadow-card-md">
            <div className="flex items-center gap-2 text-xs font-semibold text-heading">
              <ThermometerSun className="size-4 text-dusty-red" />
              体感 {demoWeather.feelsLikeC}C
            </div>
          </div>
          <div className="absolute bottom-6 right-5 rounded-[8px] bg-natural-black px-3 py-2 text-natural-white shadow-card-md">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <MapPin className="size-4 text-primary" />
              {route.name}
            </div>
          </div>
          <div className="absolute left-[42%] top-[42%] size-5 rounded-full border-4 border-natural-white bg-primary shadow-card-md" />
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-[8px] bg-natural-white p-4 shadow-card-md">
            <div className="text-xs font-semibold text-dusty-green">推荐</div>
            <h3 className="mt-2 text-xl font-semibold leading-7 text-heading">
              {advice.headline}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{advice.summary}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {advice.reasons.map((reason) => (
              <div key={reason.label} className="rounded-[8px] bg-secondary p-3">
                <div className="text-base font-semibold text-heading">{reason.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{reason.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {demoPois.slice(0, 2).map((poi) => (
              <div key={poi.id} className="flex items-center justify-between gap-3 rounded-[8px] border border-natural-black/10 bg-natural-white px-3 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-heading">{poi.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{poi.rule}</div>
                </div>
                <TrustBadge trust={poi.trust} />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-[8px] bg-natural-black px-4 py-3 text-natural-white">
            <ShieldCheck className="size-4 text-primary" aria-hidden />
            <span className="text-sm font-semibold">起终点默认隐藏，只展示聚合趋势</span>
          </div>
        </div>
      </div>
    </div>
  );
}
