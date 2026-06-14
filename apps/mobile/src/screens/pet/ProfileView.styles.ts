import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  stack: {
    gap: 14
  },
  profilePanel: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4
  },
  profileAvatar: {
    borderColor: "#EEF0FF",
    borderRadius: 58,
    borderWidth: 4,
    height: 116,
    width: 116
  },
  profileName: {
    color: "#242833",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 14
  },
  profileMeta: {
    color: "#6F7382",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EAEDF5",
    borderRadius: 22,
    borderWidth: 1,
    padding: 16
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 13
  },
  profileChip: {
    backgroundColor: "#F7F9F5",
    borderColor: "#DDE8D8",
    borderRadius: 16,
    borderWidth: 1,
    color: "#334139",
    fontSize: 14,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 9
  }
});
