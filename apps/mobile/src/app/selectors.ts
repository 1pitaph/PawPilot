import type { Poi } from "@pets/shared";

export function getVerifiedPoiCount(pois: Poi[]) {
  return pois.filter(
    (poi) => poi.trust === "verified" && poi.lastVerifiedDays <= 7
  ).length;
}
