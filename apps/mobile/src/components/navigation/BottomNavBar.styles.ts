import { StyleSheet } from "react-native";
import { BOTTOM_NAV_HEIGHT } from "../../app/constants";

export const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderColor: "rgba(42,46,56,0.08)",
    borderRadius: 34,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 10,
    left: 14,
    overflow: "visible",
    position: "absolute",
    right: 14,
    shadowColor: "#2F3445",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.11,
    shadowRadius: 22,
    zIndex: 5,
    elevation: 12
  },
  bottomNavContent: {
    alignItems: "center",
    flexDirection: "row",
    height: BOTTOM_NAV_HEIGHT,
    justifyContent: "space-around",
    paddingHorizontal: 8
  },
  bottomNavItem: {
    alignItems: "center",
    borderRadius: 28,
    flex: 1,
    gap: 4,
    height: 58,
    justifyContent: "center",
    minWidth: 52
  },
  bottomNavItemActive: {
    backgroundColor: "#EEF0FF"
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 13
  },
  navPressed: {
    opacity: 0.72
  },
  centerNavSlot: {
    alignItems: "center",
    justifyContent: "center",
    width: 62
  },
  centerAddButton: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 4,
    height: 60,
    justifyContent: "center",
    shadowColor: "#5260D8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26,
    shadowRadius: 16,
    transform: [{ translateY: -10 }],
    width: 60,
    elevation: 10
  },
  centerAddButtonPressed: {
    opacity: 0.88,
    transform: [{ translateY: -10 }, { scale: 0.96 }]
  }
});
