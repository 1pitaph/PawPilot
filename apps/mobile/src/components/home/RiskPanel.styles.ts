import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  riskPanel: {
    gap: 9,
    marginTop: 24
  },
  riskPanelHeader: {
    gap: 3
  },
  sectionTitle: {
    color: "#242833",
    fontSize: 19,
    fontWeight: "900"
  },
  sectionMeta: {
    color: "#747988",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18
  },
  alertRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#ECEEF8",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  alertDot: {
    backgroundColor: "#D86C4D",
    borderRadius: 5,
    height: 10,
    width: 10
  },
  alertText: {
    color: "#444956",
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  }
});
