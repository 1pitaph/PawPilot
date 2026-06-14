import { Text, View } from "react-native";

import type { Poi } from "@pets/shared";

import { TrustBadge } from "../../components/poi/TrustBadge";
import { styles } from "./PoisView.styles";

export function PoisView({ pois }: { pois: Poi[] }) {
  return (
    <View style={styles.stack}>
      {pois.map((poi) => (
        <View key={poi.id} style={styles.poiCard}>
          <View style={styles.rowBetween}>
            <View style={styles.poiTitleGroup}>
              <Text style={styles.cardTitle}>{poi.name}</Text>
              <Text style={styles.poiSource}>
                {poi.source === "custom"
                  ? "私人地点"
                  : poi.source === "apple"
                    ? "Apple 候选"
                    : "社区贡献"}
              </Text>
            </View>
            <TrustBadge trust={poi.trust} />
          </View>
          <Text style={styles.cardBody}>{poi.rule}</Text>
          <View style={styles.chipRow}>
            {poi.tags.map((tag) => (
              <Text key={tag} style={styles.chip}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
