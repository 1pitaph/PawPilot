export type DogDensity = "低" | "中" | "高";
export type PoiTrust = "verified" | "needs-recheck" | "claim";
export type PoiCategory =
  | "water"
  | "cafe"
  | "grass"
  | "clinic"
  | "pet-store"
  | "risk"
  | "custom";
export type PoiSource = "apple" | "ugc" | "custom";

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

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
  path: GeoCoordinate[];
  distanceKm: number;
  minutes: number;
  shade: number;
  fitScore: number;
  dogDensity: DogDensity;
  roadComplexity: "简单" | "中等" | "复杂";
  tags: string[];
  linkedPoiIds: string[];
}

export interface Poi {
  id: string;
  name: string;
  category: PoiCategory;
  coordinate: GeoCoordinate;
  rule: string;
  trust: PoiTrust;
  source: PoiSource;
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

export type PetDailyMood = "ready" | "warm" | "tired" | "cautious" | "needs_rest";

export interface PetDailyStatus {
  petId: string;
  date: string;
  updatedAt: string;
  headline: string;
  summary: string;
  mood: PetDailyMood;
  device: {
    batteryPercent: number;
    online: boolean;
    caregiverInitial: string;
    activityLabel: string;
    activityMinutes: number;
  };
  activity: {
    steps: number;
    usualSteps: number;
    completionRatio: number;
    intensity: "偏少" | "刚好" | "偏多";
    copy: string;
  };
  rest: {
    totalMinutes: number;
    napMinutes: number;
    quality: "不足" | "正常" | "充足";
    copy: string;
  };
  nearbyRhythm: {
    percentile: number;
    scope: "同片区同体型匿名对照";
    label: string;
    copy: string;
  };
  outdoorReadiness: {
    score: number;
    level: "稳" | "谨慎" | "不建议";
    reasons: string[];
    recommendedRouteId?: string;
    fallbackRouteId?: string;
  };
  alerts: Array<{
    type: "heat" | "dog_density" | "traffic" | "poi_uncertain" | "rest";
    title: string;
    body: string;
  }>;
  quickActions: Array<{
    id: string;
    label: string;
    target: "start_walk" | "open_map" | "log_status" | "add_poi" | "ask_agent";
  }>;
}

export type AvatarGenerationMode = "q_only" | "q_to_3d" | "rigged_3d";

export type AvatarJobStatus =
  | "queued"
  | "running"
  | "waiting_user"
  | "ready"
  | "degraded"
  | "failed"
  | "canceled";

export type AvatarPipelineStage =
  | "created"
  | "photo_uploaded"
  | "quality_checking"
  | "quality_failed"
  | "q_generating"
  | "q_ready"
  | "waiting_user_selection"
  | "multiview_generating"
  | "tripo_submitting"
  | "tripo_processing"
  | "model_downloading"
  | "model_archived"
  | "qa_running"
  | "qa_failed"
  | "prerig_checking"
  | "rigging_skipped"
  | "rigging_running"
  | "rig_ready"
  | "retarget_running"
  | "ready_2d"
  | "ready_3d"
  | "ready_rigged"
  | "ready_degraded"
  | "failed"
  | "canceled";

export type AvatarAssetKind =
  | "source_photo"
  | "q_candidate"
  | "q_selected"
  | "multiview_front"
  | "multiview_left"
  | "multiview_back"
  | "multiview_right"
  | "model_glb"
  | "model_fbx"
  | "model_usdz"
  | "rigged_glb"
  | "rigged_fbx"
  | "preview_image"
  | "quality_report"
  | "metadata";

export type AvatarProvider = "mock" | "apimart" | "openai" | "tripo" | "ultron";

export interface AvatarAsset {
  id: string;
  kind: AvatarAssetKind;
  url: string;
  provider: AvatarProvider;
  status: "pending" | "ready" | "failed";
  label?: string;
  fileName?: string;
  mimeType?: string;
  providerTaskId?: string;
  sizeBytes?: number;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface AvatarRig {
  status: "not_started" | "checking" | "skipped" | "running" | "ready" | "failed";
  riggable?: boolean;
  skeletonType?: "biped" | "quadruped" | "hexapod" | "octopod" | "avian" | "serpentine" | "aquatic";
  providerTaskId?: string;
  animationClips: string[];
  errorMessage?: string;
}

export interface AvatarQualityReport {
  passed: boolean;
  score: number;
  checks: Array<{
    id: string;
    label: string;
    passed: boolean;
    detail: string;
  }>;
}

export interface AvatarGenerationJob {
  id: string;
  petId: string;
  mode: AvatarGenerationMode;
  status: AvatarJobStatus;
  stage: AvatarPipelineStage;
  progress: number;
  headline: string;
  message: string;
  sourceFileIds: string[];
  assets: AvatarAsset[];
  selectedQAssetId?: string;
  providerTaskIds: string[];
  rig: AvatarRig;
  qualityReport?: AvatarQualityReport;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvatarJobRequest {
  petId: string;
  sourceFileIds: string[];
  sourceImageUrls?: string[];
  candidateCount?: number;
  mode?: AvatarGenerationMode;
  tryRig?: boolean;
  autoSelectFirstCandidate?: boolean;
  geometryQuality?: "standard" | "detailed";
  idempotencyKey?: string;
}

export interface CreateAvatarJobResponse {
  job: AvatarGenerationJob;
}

export interface SelectAvatarCandidateRequest {
  selectedQAssetId: string;
}

export const avatarStageLabels: Record<AvatarPipelineStage, string> = {
  created: "创建任务",
  photo_uploaded: "照片已上传",
  quality_checking: "检查照片",
  quality_failed: "照片不可用",
  q_generating: "生成 Q 版候选",
  q_ready: "Q 版候选已就绪",
  waiting_user_selection: "等待选择主设定",
  multiview_generating: "生成多视角",
  tripo_submitting: "提交 Tripo",
  tripo_processing: "生成 3D 模型",
  model_downloading: "下载模型",
  model_archived: "归档资产",
  qa_running: "自动质检",
  qa_failed: "质检未通过",
  prerig_checking: "检查骨骼绑定",
  rigging_skipped: "跳过骨骼绑定",
  rigging_running: "绑定骨骼",
  rig_ready: "骨骼已就绪",
  retarget_running: "生成动作",
  ready_2d: "2D 分身就绪",
  ready_3d: "3D 分身就绪",
  ready_rigged: "骨骼 3D 就绪",
  ready_degraded: "降级分身就绪",
  failed: "生成失败",
  canceled: "已取消"
};

export function isAvatarJobFinal(status: AvatarJobStatus) {
  return (
    status === "ready" ||
    status === "degraded" ||
    status === "failed" ||
    status === "canceled"
  );
}

export const demoMapCenter: GeoCoordinate = {
  latitude: 31.2307,
  longitude: 121.4742
};

export const poiCategoryLabels: Record<PoiCategory, string> = {
  water: "水源",
  cafe: "咖啡",
  grass: "草地",
  clinic: "医院",
  "pet-store": "宠物店",
  risk: "风险",
  custom: "自定义"
};

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

export const demoPetDailyStatus: PetDailyStatus = {
  petId: "pet-momo",
  date: "2026-06-14",
  updatedAt: "19:10",
  headline: "糯米今天有点热",
  summary: "活动量到日常 76%，下午休息偏少；今晚优先阴影短线，别去北门草地。",
  mood: "warm",
  device: {
    batteryPercent: 93,
    online: true,
    caregiverInitial: "M",
    activityLabel: "正在轻松走",
    activityMinutes: 34
  },
  activity: {
    steps: 3420,
    usualSteps: 4500,
    completionRatio: 0.76,
    intensity: "刚好",
    copy: "不用补步，22 分钟熟路就够。"
  },
  rest: {
    totalMinutes: 410,
    napMinutes: 42,
    quality: "不足",
    copy: "午后休息少，遇狗多路线容易紧张。"
  },
  nearbyRhythm: {
    percentile: 58,
    scope: "同片区同体型匿名对照",
    label: "附近节奏中等",
    copy: "只是参考附近活动节奏，不做排名。"
  },
  outdoorReadiness: {
    score: 82,
    level: "稳",
    reasons: ["体感 32C", "狗密度低", "阴影 86%", "路口简单"],
    recommendedRouteId: "route-plane-tree",
    fallbackRouteId: "route-grass-loop"
  },
  alerts: [
    {
      type: "heat",
      title: "前 10 分钟观察喘气",
      body: "地面热感为中，别临时拉长路线。"
    },
    {
      type: "dog_density",
      title: "北门草地今天不放首推",
      body: "待复查且傍晚狗较多，反应犬先绕开。"
    },
    {
      type: "poi_uncertain",
      title: "巷口水碗可短暂停留",
      body: "2 天前验证仍可用，建议停留不超过 5 分钟。"
    }
  ],
  quickActions: [
    { id: "start", label: "开始轻松走", target: "start_walk" },
    { id: "map", label: "看阴影短线", target: "open_map" },
    { id: "log", label: "记录状态", target: "log_status" }
  ]
};

export const demoRoutes: RoutineRoute[] = [
  {
    id: "route-plane-tree",
    name: "梧桐阴影线",
    description: "熟悉、阴影多、路口少，适合怕热和怕车的小型犬。",
    path: [
      { latitude: 31.2307, longitude: 121.4742 },
      { latitude: 31.2313, longitude: 121.4736 },
      { latitude: 31.2321, longitude: 121.4741 },
      { latitude: 31.2324, longitude: 121.4751 },
      { latitude: 31.2315, longitude: 121.4757 },
      { latitude: 31.2307, longitude: 121.4742 }
    ],
    distanceKm: 1.4,
    minutes: 22,
    shade: 86,
    fitScore: 88,
    dogDensity: "低",
    roadComplexity: "简单",
    tags: ["阴影多", "低狗密度", "可快速回家"],
    linkedPoiIds: ["poi-water-bowl", "poi-cafe"]
  },
  {
    id: "route-grass-loop",
    name: "社区草地环线",
    description: "有草地和水碗，但傍晚狗较多，反应犬需要降级使用。",
    path: [
      { latitude: 31.2307, longitude: 121.4742 },
      { latitude: 31.2299, longitude: 121.4733 },
      { latitude: 31.2291, longitude: 121.4743 },
      { latitude: 31.2296, longitude: 121.4758 },
      { latitude: 31.2308, longitude: 121.4754 }
    ],
    distanceKm: 1.9,
    minutes: 31,
    shade: 62,
    fitScore: 70,
    dogDensity: "中",
    roadComplexity: "中等",
    tags: ["有草地", "水源", "傍晚需观察"],
    linkedPoiIds: ["poi-grass", "poi-water-bowl"]
  },
  {
    id: "route-market",
    name: "街角咖啡目标线",
    description: "可以顺路到宠物友好咖啡店，但会经过两处电动车多的路口。",
    path: [
      { latitude: 31.2307, longitude: 121.4742 },
      { latitude: 31.2311, longitude: 121.4755 },
      { latitude: 31.2318, longitude: 121.4764 },
      { latitude: 31.2328, longitude: 121.4761 },
      { latitude: 31.2332, longitude: 121.4749 }
    ],
    distanceKm: 2.2,
    minutes: 36,
    shade: 48,
    fitScore: 58,
    dogDensity: "中",
    roadComplexity: "复杂",
    tags: ["可到 POI", "车流较多", "不适合高温"],
    linkedPoiIds: ["poi-cafe", "poi-pet-store", "poi-scooter-crossing"]
  }
];

export const demoPois: Poi[] = [
  {
    id: "poi-water-bowl",
    name: "巷口水碗",
    category: "water",
    coordinate: { latitude: 31.2316, longitude: 121.4747 },
    rule: "用户 2 天前确认仍可用，建议停留不超过 5 分钟。",
    trust: "verified",
    source: "ugc",
    tags: ["水源", "门口停留", "最近验证"],
    lastVerifiedDays: 2
  },
  {
    id: "poi-cafe",
    name: "一树咖啡露台",
    category: "cafe",
    coordinate: { latitude: 31.2329, longitude: 121.4752 },
    rule: "仅露台可带宠，小型犬友好；雨天和高温时体验不稳定。",
    trust: "verified",
    source: "ugc",
    tags: ["仅露台", "小型犬", "有阴影"],
    lastVerifiedDays: 6
  },
  {
    id: "poi-grass",
    name: "北门草地",
    category: "grass",
    coordinate: { latitude: 31.2293, longitude: 121.4751 },
    rule: "社区反馈傍晚狗多，反应犬建议绕开或改早晚低峰。",
    trust: "needs-recheck",
    source: "ugc",
    tags: ["草地", "狗多", "待复查"],
    lastVerifiedDays: 18
  },
  {
    id: "poi-pet-store",
    name: "顺路宠物补给站",
    category: "pet-store",
    coordinate: { latitude: 31.2321, longitude: 121.4763 },
    rule: "Apple 地图候选，爪边尚未验证宠物进入规则。",
    trust: "claim",
    source: "apple",
    tags: ["Apple POI", "待验证", "宠物店"],
    lastVerifiedDays: 99
  },
  {
    id: "poi-scooter-crossing",
    name: "电动车高压路口",
    category: "risk",
    coordinate: { latitude: 31.2312, longitude: 121.4756 },
    rule: "社区 1 天前标记晚高峰电动车多，怕车犬建议绕行。",
    trust: "verified",
    source: "ugc",
    tags: ["风险点", "电动车多", "晚高峰"],
    lastVerifiedDays: 1
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
