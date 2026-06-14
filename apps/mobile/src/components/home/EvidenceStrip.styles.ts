import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  evidenceStrip: {
    flexDirection: "row",
    gap: 9,
    marginTop: 20
  },
  evidenceItem: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#ECEEF8",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 70,
    justifyContent: "center",
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3
  },
  evidenceValue: {
    color: "#242833",
    fontSize: 17,
    fontWeight: "900"
  },
  evidenceLabel: {
    color: "#7D8190",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  }
});
