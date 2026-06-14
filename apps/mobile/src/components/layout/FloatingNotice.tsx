import { Pressable, Text } from "react-native";

import { styles } from "./FloatingNotice.styles";

export function FloatingNotice({
  bottom,
  copy,
  onPress
}: {
  bottom: number;
  copy: { title: string; text: string };
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityHint="Dismisses the current tip"
      accessibilityLabel={copy.title}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.floatingNotice, { bottom }]}
    >
      <Text style={styles.floatingNoticeTitle}>{copy.title}</Text>
      <Text style={styles.floatingNoticeText}>{copy.text}</Text>
    </Pressable>
  );
}
