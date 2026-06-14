import { Map, RefreshCw } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

import type { RoutineRoute } from "@pets/shared";

import { images } from "../../assets/images";
import { styles } from "./PrimaryRouteCard.styles";

export function PrimaryRouteCard({
  routes,
  onOpenMap,
  onRouteSwap,
  route
}: {
  routes: RoutineRoute[];
  onOpenMap: () => void;
  onRouteSwap: () => void;
  route: RoutineRoute;
}) {
  return (
    <View style={styles.primaryRouteCard}>
      <View style={styles.primaryRouteContent}>
        <View style={styles.primaryRouteText}>
          <Text style={styles.cardKicker}>今日推荐路线</Text>
          <Text numberOfLines={1} style={styles.primaryRouteTitle}>
            {route.name}
          </Text>
          <Text numberOfLines={2} style={styles.primaryRouteBody}>
            {route.description}
          </Text>

          <View style={styles.routeProgress}>
            {routes.map((routeItem) => (
              <View
                key={routeItem.id}
                style={[
                  styles.routeProgressDot,
                  routeItem.id === route.id && styles.routeProgressDotActive
                ]}
              />
            ))}
          </View>
        </View>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={images.quietWalkRoute}
          style={styles.routeImage}
        />
      </View>

      <View style={styles.primaryActions}>
        <Pressable
          accessibilityLabel="Open route map"
          accessibilityRole="button"
          onPress={onOpenMap}
          style={({ pressed }) => [
            styles.primaryActionButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Map color="#FFFFFF" size={17} strokeWidth={2.6} />
          <Text style={styles.primaryActionText}>看地图</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Try another route"
          accessibilityRole="button"
          onPress={onRouteSwap}
          style={({ pressed }) => [
            styles.secondaryActionButton,
            pressed && styles.buttonPressed
          ]}
        >
          <RefreshCw color="#5C6CF6" size={17} strokeWidth={2.5} />
          <Text style={styles.secondaryActionText}>换一条</Text>
        </Pressable>
      </View>
    </View>
  );
}
