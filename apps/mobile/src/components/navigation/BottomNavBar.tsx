import { Home, Map, MapPin, Plus, UserRound, type LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { BOTTOM_NAV_HEIGHT } from "../../app/constants";
import type { TabKey } from "../../app/types";
import { styles } from "./BottomNavBar.styles";

export function BottomNavBar({
  activeTab,
  bottomSafePadding,
  onAddPress,
  onTabPress
}: {
  activeTab: TabKey;
  bottomSafePadding: number;
  onAddPress: () => void;
  onTabPress: (tab: TabKey) => void;
}) {
  return (
    <View
      style={[
        styles.bottomNav,
        {
          height: BOTTOM_NAV_HEIGHT + bottomSafePadding,
          paddingBottom: bottomSafePadding
        }
      ]}
    >
      <View style={styles.bottomNavContent} accessibilityRole="tablist">
        <BottomNavItem
          Icon={Home}
          isActive={activeTab === "today"}
          label="Today"
          onPress={() => onTabPress("today")}
        />
        <BottomNavItem
          Icon={Map}
          isActive={activeTab === "map"}
          label="Map"
          onPress={() => onTabPress("map")}
        />
        <View style={styles.centerNavSlot}>
          <CenterAddButton onPress={onAddPress} />
        </View>
        <BottomNavItem
          Icon={MapPin}
          isActive={activeTab === "spots"}
          label="Spots"
          onPress={() => onTabPress("spots")}
        />
        <BottomNavItem
          Icon={UserRound}
          isActive={activeTab === "pet"}
          label="Pet"
          onPress={() => onTabPress("pet")}
        />
      </View>
    </View>
  );
}

function BottomNavItem({
  Icon,
  isActive,
  label,
  onPress
}: {
  Icon: LucideIcon;
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  const color = isActive ? "#5C6CF6" : "#6E7280";

  return (
    <Pressable
      accessibilityHint={`Switches to ${label}`}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.bottomNavItem,
        isActive && styles.bottomNavItemActive,
        pressed && styles.navPressed
      ]}
    >
      <Icon color={color} size={23} strokeWidth={2.55} />
      <Text style={[styles.bottomNavLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

function CenterAddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityHint="Starts adding a custom POI on the map"
      accessibilityLabel="Add place or risk"
      accessibilityRole="button"
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [
        styles.centerAddButton,
        pressed && styles.centerAddButtonPressed
      ]}
    >
      <Plus color="#FFFFFF" size={28} strokeWidth={2.6} />
    </Pressable>
  );
}
