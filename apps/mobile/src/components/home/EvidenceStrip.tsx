import { Text, View } from "react-native";

import type { RoutineRoute } from "@pets/shared";

import { styles } from "./EvidenceStrip.styles";

export function EvidenceStrip({
  route,
  verifiedPoiCount
}: {
  route: RoutineRoute;
  verifiedPoiCount: number;
}) {
  return (
    <View style={styles.evidenceStrip}>
      <EvidenceItem label="阴影" value={`${route.shade}%`} />
      <EvidenceItem label="狗密度" value={route.dogDensity} />
      <EvidenceItem label="可信 POI" value={`${verifiedPoiCount} 个`} />
    </View>
  );
}

function EvidenceItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.evidenceItem}>
      <Text style={styles.evidenceValue}>{value}</Text>
      <Text style={styles.evidenceLabel}>{label}</Text>
    </View>
  );
}
