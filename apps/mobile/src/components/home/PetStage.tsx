import { PawPrint } from "lucide-react-native";
import { Image, Text, View } from "react-native";

import type { RoutineRoute } from "@pets/shared";

import { images } from "../../assets/images";
import { styles } from "./PetStage.styles";

export function PetStage({
  bubbleText,
  route,
  weatherLabel
}: {
  bubbleText: string;
  route: RoutineRoute;
  weatherLabel: string;
}) {
  return (
    <View style={styles.petStage}>
      <View style={styles.petImageFrame}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={images.petMascot}
          style={styles.petImage}
        />
      </View>
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>{bubbleText}</Text>
        <View style={styles.speechTail} />
      </View>
      <View style={styles.stageBadge}>
        <PawPrint color="#FFFFFF" size={17} strokeWidth={2.6} />
        <Text style={styles.stageBadgeText}>{route.fitScore}% 适配</Text>
      </View>
      <View style={styles.weatherBadge}>
        <Text style={styles.weatherBadgeText}>{weatherLabel}</Text>
      </View>
    </View>
  );
}
