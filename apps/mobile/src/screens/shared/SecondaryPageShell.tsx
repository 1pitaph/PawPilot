import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

import { styles } from "./SecondaryPageShell.styles";

export function SecondaryPageShell({
  bottomPadding,
  children,
  eyebrow,
  subtitle,
  title
}: {
  bottomPadding: number;
  children: ReactNode;
  eyebrow: string;
  subtitle: string;
  title: string;
}) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.secondaryScrollContent,
        { paddingBottom: bottomPadding }
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.secondaryScroll}
    >
      <View style={styles.secondaryHeader}>
        <Text style={styles.secondaryEyebrow}>{eyebrow}</Text>
        <Text style={styles.secondaryTitle}>{title}</Text>
        <Text style={styles.secondarySubtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}
