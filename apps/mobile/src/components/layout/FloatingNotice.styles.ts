import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  floatingNotice: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(92,108,246,0.14)",
    borderRadius: 18,
    borderWidth: 1,
    left: 18,
    paddingHorizontal: 15,
    paddingVertical: 13,
    position: "absolute",
    right: 18,
    shadowColor: "#2F3445",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    zIndex: 4,
    elevation: 11
  },
  floatingNoticeTitle: {
    color: "#242833",
    fontSize: 15,
    fontWeight: "900"
  },
  floatingNoticeText: {
    color: "#6F7382",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 4
  }
});
