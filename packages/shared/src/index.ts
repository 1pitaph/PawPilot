export type DogDensity = "低" | "中" | "高";
export type PoiTrust = "verified" | "needs-recheck";

export interface PetProfile {
  id: string;
  name: string;
  species: "dog";
  size: "小型犬" | "中型犬" | "大型犬";
  ageLabel: string;
  walkMinutes: number;
  heatSensitive: boolean;
  dogReactive: boolean;
  trafficSensitive: boolean;
  socialPreference: "避狗" | "适度社交" | "喜欢社交";
  traits: string[];
}

export interface RoutineRoute {
  id: string;
  name: string;
  description: string;
  distanceKm: number;
  minutes: number;
  shade: number;
  fitScore: number;
  dogDensity: DogDensity;
  roadComplexity: "简单" | "中等" | "复杂";
  tags: string[];
}

export interface Poi {
  id: string;
  name: string;
  rule: string;
  trust: PoiTrust;
  tags: string[];
  lastVerifiedDays: number;
}

export interface WeatherSignal {
  temperatureC: number;
  feelsLikeC: number;
  rainChance: number;
  pavementRisk: "低" | "中" | "高";
  timeLabel: string;
}

export interface DepartureAdviceInput {
  pet: PetProfile;
  routes: RoutineRoute[];
  pois: Poi[];
  weather: WeatherSignal;
}

export interface DepartureAdvice {
  headline: string;
  summary: string;
  recommendedRoute: RoutineRoute;
  fallbackRoute: RoutineRoute;
  reasons: Array<{
    label: string;
    value: string;
  }>;
  alerts: string[];
}

export const demoPet: PetProfile = {
  id: "pet-momo",
  name: "糯米",
  species: "dog",
  size: "小型犬",
  ageLabel: "3 岁",
  walkMinutes: 28,
  heatSensitive: true,
  dogReactive: true,
  trafficSensitive: true,
  socialPreference: "避狗",
  traits: ["怕热", "怕大狗", "怕电动车", "需要阴影", "适合短路线"]
};

export const demoWeather: WeatherSignal = {
  temperatureC: 29,
  feelsLikeC: 32,
  rainChance: 20,
  pavementRisk: "中",
  timeLabel: "今晚 19:30"
};

export const demoRoutes: RoutineRoute[] = [
  {
    id: "route-plane-tree",
    name: "梧桐阴影线",
    description: "熟悉、阴影多、路口少，适合怕热和怕车的小型犬。",
    distanceKm: 1.4,
    minutes: 22,
    shade: 86,
    fitScore: 88,
    dogDensity: "低",
    roadComplexity: "简单",
    tags: ["阴影多", "低狗密度", "可快速回家"]
  },
  {
    id: "route-grass-loop",
    name: "社区草地环线",
    description: "有草地和水碗，但傍晚狗较多，反应犬需要降级使用。",
    distanceKm: 1.9,
    minutes: 31,
    shade: 62,
    fitScore: 70,
    dogDensity: "中",
    roadComplexity: "中等",
    tags: ["有草地", "水源", "傍晚需观察"]
  },
  {
    id: "route-market",
    name: "街角咖啡目标线",
    description: "可以顺路到宠物友好咖啡店，但会经过两处电动车多的路口。",
    distanceKm: 2.2,
    minutes: 36,
    shade: 48,
    fitScore: 58,
    dogDensity: "中",
    roadComplexity: "复杂",
    tags: ["可到 POI", "车流较多", "不适合高温"]
  }
];

export const demoPois: Poi[] = [
  {
    id: "poi-water-bowl",
    name: "巷口水碗",
    rule: "用户 2 天前确认仍可用，建议停留不超过 5 分钟。",
    trust: "verified",
    tags: ["水源", "门口停留", "最近验证"],
    lastVerifiedDays: 2
  },
  {
    id: "poi-cafe",
    name: "一树咖啡露台",
    rule: "仅露台可带宠，小型犬友好；雨天和高温时体验不稳定。",
    trust: "verified",
    tags: ["仅露台", "小型犬", "有阴影"],
    lastVerifiedDays: 6
  },
  {
    id: "poi-grass",
    name: "北门草地",
    rule: "社区反馈傍晚狗多，反应犬建议绕开或改早晚低峰。",
    trust: "needs-recheck",
    tags: ["草地", "狗多", "待复查"],
    lastVerifiedDays: 18
  }
];

export function buildDepartureAdvice(
  input: DepartureAdviceInput
): DepartureAdvice {
  const scoredRoutes = input.routes
    .map((route) => ({
      route,
      score: route.fitScore + getPetRouteAdjustment(input.pet, route, input.weather)
    }))
    .sort((left, right) => right.score - left.score);

  const recommendedRoute = scoredRoutes[0]?.route ?? input.routes[0];
  const fallbackRoute = scoredRoutes[1]?.route ?? recommendedRoute;
  const verifiedPoiCount = input.pois.filter(
    (poi) => poi.trust === "verified" && poi.lastVerifiedDays <= 7
  ).length;

  return {
    headline: `${input.weather.timeLabel} 先走${recommendedRoute.name}`,
    summary:
      "今天体感偏热，糯米又怕车和大狗，系统优先选择熟悉、阴影多、狗密度低的路线；如果路口变复杂，就缩短到楼下短线。",
    recommendedRoute,
    fallbackRoute,
    reasons: [
      { label: "体感温度", value: `${input.weather.feelsLikeC}C` },
      { label: "适配度", value: `${recommendedRoute.fitScore}%` },
      { label: "可信 POI", value: `${verifiedPoiCount} 个` }
    ],
    alerts: [
      "地面热感为中，前 10 分钟观察爪垫和喘气。",
      `${fallbackRoute.name} 可以作为降级备选，不建议临时拉长路线。`,
      "北门草地待复查，反应犬今天不作为默认推荐。"
    ]
  };
}

function getPetRouteAdjustment(
  pet: PetProfile,
  route: RoutineRoute,
  weather: WeatherSignal
) {
  let adjustment = 0;

  if (pet.heatSensitive && weather.feelsLikeC >= 30) {
    adjustment += route.shade >= 80 ? 8 : -10;
  }

  if (pet.dogReactive) {
    adjustment += route.dogDensity === "低" ? 10 : -8;
  }

  if (pet.trafficSensitive) {
    adjustment += route.roadComplexity === "简单" ? 6 : -6;
  }

  if (route.minutes > pet.walkMinutes) {
    adjustment -= 8;
  }

  return adjustment;
}
