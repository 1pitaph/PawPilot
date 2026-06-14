import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  petStage: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 326,
    paddingTop: 8
  },
  petImageFrame: {
    backgroundColor: "#FFF6EA",
    borderColor: "rgba(255,255,255,0.88)",
    borderRadius: 132,
    borderWidth: 1,
    height: 244,
    overflow: "hidden",
    shadowColor: "#8F7355",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 26,
    width: 244,
    elevation: 8
  },
  petImage: {
    height: "100%",
    width: "100%"
  },
  speechBubble: {
    backgroundColor: "#3C3C43",
    borderRadius: 14,
    maxWidth: 214,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: "absolute",
    right: 8,
    top: 154
  },
  speechText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 19
  },
  speechTail: {
    backgroundColor: "#3C3C43",
    bottom: -8,
    height: 16,
    position: "absolute",
    right: 38,
    transform: [{ rotate: "45deg" }],
    width: 16
  },
  stageBadge: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 23,
    borderWidth: 2,
    bottom: 30,
    flexDirection: "row",
    gap: 6,
    minHeight: 42,
    paddingHorizontal: 13,
    position: "absolute"
  },
  stageBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  weatherBadge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    left: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "absolute",
    top: 48
  },
  weatherBadgeText: {
    color: "#7B5B2A",
    fontSize: 13,
    fontWeight: "900"
  }
});
