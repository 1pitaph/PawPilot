import { Text, View } from "react-native";

import { styles } from "./RiskPanel.styles";

export function RiskPanel({ alerts }: { alerts: string[] }) {
  return (
    <View style={styles.riskPanel}>
      <View style={styles.riskPanelHeader}>
        <Text style={styles.sectionTitle}>路上关注</Text>
        <Text style={styles.sectionMeta}>来自天气、路线和社区信号</Text>
      </View>
      {alerts.map((alert) => (
        <View key={alert} style={styles.alertRow}>
          <View style={styles.alertDot} />
          <Text style={styles.alertText}>{alert}</Text>
        </View>
      ))}
    </View>
  );
}
