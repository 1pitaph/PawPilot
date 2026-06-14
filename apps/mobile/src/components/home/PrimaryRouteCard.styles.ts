import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  primaryRouteCard: {
    backgroundColor: "#DDEBFF",
    borderColor: "#D4E3FB",
    borderRadius: 28,
    borderWidth: 1,
    marginTop: 22,
    padding: 18,
    shadowColor: "#7790B4",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6
  },
  primaryRouteContent: {
    flexDirection: "row",
    gap: 14
  },
  primaryRouteText: {
    flex: 1,
    minWidth: 0
  },
  cardKicker: {
    color: "#242833",
    fontSize: 16,
    fontWeight: "900"
  },
  primaryRouteTitle: {
    color: "#5E6574",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 12
  },
  primaryRouteBody: {
    color: "#5F6674",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8
  },
  routeProgress: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  routeProgressDot: {
    backgroundColor: "#BCC8DA",
    borderRadius: 5,
    height: 10,
    width: 10
  },
  routeProgressDotActive: {
    backgroundColor: "#5C6CF6",
    width: 18
  },
  routeImage: {
    borderRadius: 18,
    height: 110,
    width: 110
  },
  primaryActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18
  },
  primaryActionButton: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderRadius: 21,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    height: 42,
    justifyContent: "center"
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  secondaryActionButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(92,108,246,0.18)",
    borderRadius: 21,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    height: 42,
    justifyContent: "center"
  },
  secondaryActionText: {
    color: "#5C6CF6",
    fontSize: 14,
    fontWeight: "900"
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  }
});
