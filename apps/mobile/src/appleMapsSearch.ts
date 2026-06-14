import {
  demoMapCenter,
  type GeoCoordinate,
  type Poi,
  type PoiCategory
} from "@pets/shared";

declare const process: {
  env?: Record<string, string | undefined>;
};

type AppleMapsSearchStatus =
  | "idle"
  | "not-configured"
  | "loading"
  | "ready"
  | "error";

interface AppleMapsSearchResponse {
  results?: AppleMapsPlace[];
}

interface AppleMapsPlace {
  name?: string;
  coordinate?: GeoCoordinate;
  formattedAddressLines?: string[];
}

export interface AppleMapsSearchResult {
  pois: Poi[];
  status: AppleMapsSearchStatus;
}

export async function searchAppleMapPois(
  query: string,
  searchLocation: GeoCoordinate = demoMapCenter
): Promise<AppleMapsSearchResult> {
  const token = process.env?.EXPO_PUBLIC_APPLE_MAPS_TOKEN;
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return { pois: [], status: "idle" };
  }

  if (!token) {
    return { pois: [], status: "not-configured" };
  }

  const params = [
    ["q", trimmedQuery],
    ["resultTypeFilter", "Poi"],
    ["lang", "zh-CN"],
    [
      "searchLocation",
      `${searchLocation.latitude},${searchLocation.longitude}`
    ]
  ]
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  try {
    const response = await fetch(
      `https://maps-api.apple.com/v1/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      return { pois: [], status: "error" };
    }

    const data = (await response.json()) as AppleMapsSearchResponse;
    const pois = (data.results ?? [])
      .filter(hasNameAndCoordinate)
      .slice(0, 8)
      .map((place, index) =>
        applePlaceToPoi(place, trimmedQuery, index)
      );

    return { pois, status: "ready" };
  } catch {
    return { pois: [], status: "error" };
  }
}

function hasNameAndCoordinate(
  place: AppleMapsPlace
): place is Required<Pick<AppleMapsPlace, "name" | "coordinate">> &
  AppleMapsPlace {
  return Boolean(place.name && place.coordinate);
}

function applePlaceToPoi(
  place: Required<Pick<AppleMapsPlace, "name" | "coordinate">> &
    AppleMapsPlace,
  query: string,
  index: number
): Poi {
  const category = inferApplePoiCategory(query, place.name);
  const address = place.formattedAddressLines?.join("，");

  return {
    id: `apple-${slugify(place.name)}-${index}`,
    name: place.name,
    category,
    coordinate: place.coordinate,
    rule: address
      ? `Apple Maps 搜索候选：${address}。爪边尚未验证宠物进入规则。`
      : "Apple Maps 搜索候选，爪边尚未验证宠物进入规则。",
    trust: "claim",
    source: "apple",
    tags: ["Apple POI", "待验证"],
    lastVerifiedDays: 99
  };
}

function inferApplePoiCategory(query: string, name: string): PoiCategory {
  const text = `${query} ${name}`.toLowerCase();

  if (text.includes("cafe") || text.includes("coffee") || text.includes("咖啡")) {
    return "cafe";
  }

  if (text.includes("医院") || text.includes("clinic") || text.includes("vet")) {
    return "clinic";
  }

  if (text.includes("宠物") || text.includes("pet")) {
    return "pet-store";
  }

  if (text.includes("公园") || text.includes("草地") || text.includes("park")) {
    return "grass";
  }

  return "custom";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}
