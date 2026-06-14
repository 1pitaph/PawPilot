import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  stack: {
    gap: 14
  },
  poiCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  poiTitleGroup: {
    flex: 1,
    minWidth: 0
  },
  cardTitle: {
    color: "#242833",
    flex: 1,
    fontSize: 17,
    fontWeight: "900"
  },
  poiSource: {
    color: "#7D8190",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  cardBody: {
    color: "#5F6674",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 10
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 13
  },
  chip: {
    backgroundColor: "#F4F6FA",
    borderColor: "#EAEDF5",
    borderRadius: 14,
    borderWidth: 1,
    color: "#4E596B",
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7
  }
});
