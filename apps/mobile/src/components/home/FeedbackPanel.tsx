import { Pressable, Text, View } from "react-native";

import type { FeedbackState } from "../../app/types";
import { styles } from "./FeedbackPanel.styles";

export function FeedbackPanel({
  feedbackState,
  onDismissNotice,
  onFeedback,
  showReset
}: {
  feedbackState: FeedbackState;
  onDismissNotice: () => void;
  onFeedback: (state: Exclude<FeedbackState, "idle">) => void;
  showReset: boolean;
}) {
  const summary =
    feedbackState === "idle"
      ? "走完后只问两个问题，反馈会写回下一次推荐。"
      : feedbackState === "smooth"
        ? "已记住这次顺利，下一次会更信任这条路线。"
        : "已标记有新风险，建议在地图上补充位置。";

  return (
    <View style={styles.feedbackPanel}>
      <Text style={styles.feedbackTitle}>回来后怎么记？</Text>
      <Text style={styles.feedbackSummary}>{summary}</Text>
      <View style={styles.feedbackActions}>
        <Pressable
          accessibilityLabel="Mark walk smooth"
          accessibilityRole="button"
          onPress={() => onFeedback("smooth")}
          style={[
            styles.feedbackButton,
            feedbackState === "smooth" && styles.feedbackButtonActive
          ]}
        >
          <Text
            style={[
              styles.feedbackButtonText,
              feedbackState === "smooth" && styles.feedbackButtonTextActive
            ]}
          >
            顺利
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Mark new risk"
          accessibilityRole="button"
          onPress={() => onFeedback("risk")}
          style={[
            styles.feedbackButtonSecondary,
            feedbackState === "risk" && styles.feedbackButtonDangerActive
          ]}
        >
          <Text
            style={[
              styles.feedbackButtonTextSecondary,
              feedbackState === "risk" && styles.feedbackButtonTextActive
            ]}
          >
            有新风险
          </Text>
        </Pressable>
      </View>
      {showReset && (
        <Pressable
          accessibilityLabel="Dismiss current notice"
          accessibilityRole="button"
          onPress={onDismissNotice}
          style={styles.dismissNoticeButton}
        >
          <Text style={styles.dismissNoticeText}>收起提示</Text>
        </Pressable>
      )}
    </View>
  );
}
