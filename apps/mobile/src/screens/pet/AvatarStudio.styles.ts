import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  avatarStudio: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E9F5",
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 16,
    shadowColor: "#64708A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 4
  },
  avatarStudioHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11
  },
  avatarStudioIcon: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  avatarStudioTitleGroup: {
    flex: 1,
    minWidth: 0
  },
  avatarStudioTitle: {
    color: "#242833",
    fontSize: 18,
    fontWeight: "900"
  },
  avatarStudioMeta: {
    color: "#717789",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3
  },
  avatarPreviewRow: {
    flexDirection: "row",
    gap: 14
  },
  avatarPreviewFrame: {
    backgroundColor: "#FFF6EA",
    borderColor: "#EEF0FF",
    borderRadius: 26,
    borderWidth: 1,
    height: 126,
    overflow: "hidden",
    width: 126
  },
  avatarPreviewImage: {
    height: "100%",
    width: "100%"
  },
  avatarProgressPanel: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0
  },
  avatarProgressValue: {
    color: "#242833",
    fontSize: 28,
    fontWeight: "900"
  },
  avatarProgressLabel: {
    color: "#3F4657",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 1
  },
  avatarProgressTrack: {
    backgroundColor: "#EEF0FF",
    borderRadius: 7,
    height: 8,
    marginTop: 10,
    overflow: "hidden"
  },
  avatarProgressFill: {
    backgroundColor: "#5C6CF6",
    borderRadius: 7,
    height: "100%"
  },
  avatarProgressMessage: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 9
  },
  avatarCandidateSection: {
    gap: 9
  },
  avatarSubTitle: {
    color: "#242833",
    fontSize: 15,
    fontWeight: "900"
  },
  avatarCandidateScroll: {
    marginHorizontal: -3
  },
  avatarCandidateCard: {
    backgroundColor: "#F8F9FC",
    borderColor: "#E8ECF4",
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 3,
    padding: 7,
    width: 94
  },
  avatarCandidateCardSelected: {
    borderColor: "#5C6CF6",
    borderWidth: 2
  },
  avatarCandidateImage: {
    backgroundColor: "#FFF6EA",
    borderRadius: 12,
    height: 78,
    width: "100%"
  },
  avatarCandidateLabel: {
    color: "#4E596B",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 6,
    textAlign: "center"
  },
  avatarAssetPanel: {
    alignItems: "center",
    backgroundColor: "#F2FAF6",
    borderColor: "#D8EFE2",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    minHeight: 62,
    paddingHorizontal: 12
  },
  avatarAssetIcon: {
    alignItems: "center",
    backgroundColor: "#DCEFE6",
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  avatarAssetText: {
    flex: 1,
    minWidth: 0
  },
  avatarAssetTitle: {
    color: "#26322D",
    fontSize: 14,
    fontWeight: "900"
  },
  avatarAssetMeta: {
    color: "#617066",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3
  },
  avatarQaGrid: {
    flexDirection: "row",
    gap: 8
  },
  avatarQaItem: {
    backgroundColor: "#F7F9F5",
    borderColor: "#DDE8D8",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  avatarQaLabel: {
    color: "#59665D",
    fontSize: 11,
    fontWeight: "800"
  },
  avatarQaStatus: {
    color: "#176B52",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 4
  },
  avatarQaStatusWarn: {
    color: "#8C5B13"
  },
  avatarErrorText: {
    backgroundColor: "#FFF0D4",
    borderRadius: 14,
    color: "#8C5B13",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
    paddingHorizontal: 11,
    paddingVertical: 9
  },
  avatarActions: {
    flexDirection: "row",
    gap: 10
  },
  avatarPrimaryButton: {
    alignItems: "center",
    backgroundColor: "#5C6CF6",
    borderRadius: 21,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    height: 42,
    justifyContent: "center"
  },
  avatarSecondaryButton: {
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
  avatarButtonDisabled: {
    opacity: 0.6
  },
  avatarPrimaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900"
  },
  avatarSecondaryButtonText: {
    color: "#5C6CF6",
    fontSize: 14,
    fontWeight: "900"
  },
  avatarApiHint: {
    color: "#969CAA",
    fontSize: 11,
    fontWeight: "700"
  },
  cardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  }
});
