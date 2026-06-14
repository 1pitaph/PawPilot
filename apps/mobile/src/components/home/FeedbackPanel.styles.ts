import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  feedbackPanel: {
    backgroundColor: "#26322D",
    borderRadius: 24,
    gap: 11,
    marginTop: 22,
    padding: 16
  },
  feedbackTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900"
  },
  feedbackSummary: {
    color: "#DCEAE3",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  feedbackActions: {
    flexDirection: "row",
    gap: 10
  },
  feedbackButton: {
    alignItems: "center",
    backgroundColor: "#E6F3EA",
    borderRadius: 20,
    flex: 1,
    height: 42,
    justifyContent: "center"
  },
  feedbackButtonSecondary: {
    alignItems: "center",
    backgroundColor: "#F7E8BF",
    borderRadius: 20,
    flex: 1,
    height: 42,
    justifyContent: "center"
  },
  feedbackButtonActive: {
    backgroundColor: "#31A66C"
  },
  feedbackButtonDangerActive: {
    backgroundColor: "#D86C4D"
  },
  feedbackButtonText: {
    color: "#176B52",
    fontSize: 15,
    fontWeight: "900"
  },
  feedbackButtonTextSecondary: {
    color: "#8C5B13",
    fontSize: 15,
    fontWeight: "900"
  },
  feedbackButtonTextActive: {
    color: "#FFFFFF"
  },
  dismissNoticeButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  dismissNoticeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  }
});
