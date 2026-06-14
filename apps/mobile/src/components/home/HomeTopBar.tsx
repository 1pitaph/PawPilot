import { CloudSun, MessageCircle, Search } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

import { images } from "../../assets/images";
import { styles } from "./HomeTopBar.styles";

export function HomeTopBar({
  onAskPress,
  onAssistantPress,
  verifiedPoiCount
}: {
  onAskPress: () => void;
  onAssistantPress: () => void;
  verifiedPoiCount: number;
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.userAvatar}>
        <Image
          accessibilityIgnoresInvertColors
          source={images.petMascot}
          style={styles.userAvatarImage}
        />
      </View>
      <Pressable
        accessibilityHint="Shows the current ask-agent state"
        accessibilityLabel="Ask Pawside"
        accessibilityRole="button"
        onPress={onAskPress}
        style={({ pressed }) => [
          styles.searchPill,
          pressed && styles.softPressed
        ]}
      >
        <Search color="#98A0B4" size={23} strokeWidth={2.6} />
        <Text numberOfLines={1} style={styles.searchText}>
          问爪边 / 搜附近
        </Text>
      </Pressable>
      <View style={styles.signalPill}>
        <CloudSun color="#5C6CF6" size={22} strokeWidth={2.5} />
        <Text style={styles.signalText}>{verifiedPoiCount}</Text>
      </View>
      <Pressable
        accessibilityLabel="Pet assistant"
        accessibilityRole="button"
        onPress={onAssistantPress}
        style={({ pressed }) => [
          styles.assistantButton,
          pressed && styles.softPressed
        ]}
      >
        <MessageCircle color="#5C6CF6" size={22} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}
