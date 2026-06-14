import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  actionCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    minHeight: 86,
    paddingHorizontal: 16,
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4
  },
  actionIcon: {
    alignItems: "center",
    borderRadius: 24,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  actionCopy: {
    flex: 1,
    minWidth: 0
  },
  actionTitle: {
    color: "#3B3F4C",
    fontSize: 18,
    fontWeight: "900"
  },
  actionMeta: {
    color: "#6F7382",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5
  },
  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  }
});
