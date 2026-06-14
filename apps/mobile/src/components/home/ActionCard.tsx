import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { styles } from "./ActionCard.styles";

export function ActionCard({
  Icon,
  accent,
  meta,
  onPress,
  title
}: {
  Icon: LucideIcon;
  accent: string;
  meta: string;
  onPress: () => void;
  title: string;
}) {
  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.cardPressed
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${accent}18` }]}>
        <Icon color={accent} size={24} strokeWidth={2.6} />
      </View>
      <View style={styles.actionCopy}>
        <Text numberOfLines={1} style={styles.actionTitle}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.actionMeta}>
          {meta}
        </Text>
      </View>
      <ChevronRight color="#5C6CF6" size={28} strokeWidth={2.8} />
    </Pressable>
  );
}
