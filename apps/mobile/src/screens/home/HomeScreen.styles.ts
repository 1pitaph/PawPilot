import { StyleSheet } from "react-native";

const shadowCard = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.05,
  shadowRadius: 16,
  elevation: 2
};

export const styles = StyleSheet.create({
  homeScroll: {
    backgroundColor: "#F7F7F6",
    flex: 1
  },
  homeScrollContent: {
    backgroundColor: "#F7F7F6",
    paddingHorizontal: 24,
    paddingTop: 18
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28
  },
  petIdentity: {
    flex: 1,
    minWidth: 0
  },
  petNameButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    maxWidth: 250
  },
  petName: {
    color: "#050505",
    fontSize: 43,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 48
  },
  petMeta: {
    color: "#77777A",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.2,
    lineHeight: 22,
    marginTop: 8
  },
  bellButton: {
    alignItems: "center",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  mapCard: {
    backgroundColor: "#E7E7E5",
    borderRadius: 22,
    height: 226,
    marginBottom: 30,
    overflow: "hidden",
    ...shadowCard
  },
  mapSurface: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  mapPreview: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  mapWash: {
    backgroundColor: "rgba(247,247,246,0.38)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  mapStatusRow: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.76)",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    left: 26,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "absolute",
    top: 24
  },
  mapStatusText: {
    color: "#0AA66F",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0
  },
  onlineDot: {
    backgroundColor: "#0AA66F",
    borderRadius: 8,
    height: 16,
    marginLeft: 10,
    width: 16
  },
  locateButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 23,
    height: 46,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    top: 24,
    width: 46
  },
  petMarker: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible"
  },
  petMarkerImage: {
    borderColor: "#FFFFFF",
    borderRadius: 36,
    borderWidth: 5,
    height: 72,
    width: 72
  },
  caregiverBadge: {
    alignItems: "center",
    backgroundColor: "#292929",
    borderColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 3,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    right: -4,
    top: -4,
    width: 36
  },
  caregiverBadgeText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0
  },
  walkPill: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.93)",
    borderRadius: 30,
    bottom: 28,
    flexDirection: "row",
    gap: 4,
    maxWidth: "78%",
    minHeight: 58,
    paddingHorizontal: 22,
    position: "absolute"
  },
  walkPillText: {
    color: "#050505",
    flexShrink: 1,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 25
  },
  dayHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16
  },
  dayTitle: {
    color: "#050505",
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 36
  },
  dayDate: {
    color: "#77777A",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 30
  },
  primaryMetricCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    minHeight: 152,
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingVertical: 22,
    position: "relative",
    ...shadowCard
  },
  metricCopy: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    paddingRight: 12
  },
  cardTitle: {
    color: "#050505",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 30
  },
  metricValueRow: {
    alignItems: "baseline",
    flexDirection: "row",
    marginTop: 12
  },
  primaryValue: {
    color: "#0AA66F",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 44
  },
  primaryValueMuted: {
    color: "#0AA66F",
    fontSize: 33,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 40
  },
  metricLabel: {
    color: "#77777A",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.1,
    lineHeight: 20,
    marginTop: 12
  },
  strainRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 10
  },
  strainValue: {
    color: "#242424",
    fontSize: 31,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 34
  },
  strainTrack: {
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    flex: 1,
    height: 10,
    maxWidth: 132,
    overflow: "visible"
  },
  strainFill: {
    backgroundColor: "#A7A7A7",
    borderRadius: 5,
    height: 10,
    width: "52%"
  },
  strainThumb: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D0D0D0",
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    left: "34%",
    position: "absolute",
    top: -4,
    width: 18
  },
  progressRing: {
    alignItems: "center",
    alignSelf: "center",
    height: 116,
    justifyContent: "center",
    width: 116
  },
  metricChevron: {
    position: "absolute",
    right: 24,
    top: 28
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 16
  },
  smallStatusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexBasis: "47.8%",
    flexGrow: 1,
    minHeight: 178,
    overflow: "hidden",
    padding: 18,
    position: "relative",
    ...shadowCard
  },
  smallCardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  smallCardTitle: {
    color: "#050505",
    flex: 1,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 28
  },
  smallCardLabel: {
    color: "#77777A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.8,
    lineHeight: 18,
    marginTop: 14
  },
  smallValue: {
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 36,
    marginTop: 7
  },
  smallValueBlue: {
    color: "#2459B6"
  },
  smallValueGreen: {
    color: "#0AA66F"
  },
  smallValueOrange: {
    color: "#D36A2C"
  },
  smallBody: {
    color: "#77777A",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8,
    paddingRight: 12
  },
  smallIcon: {
    alignItems: "center",
    borderRadius: 22,
    bottom: 14,
    height: 44,
    justifyContent: "center",
    opacity: 0.9,
    position: "absolute",
    right: 14,
    width: 44
  },
  smallIconBlue: {
    backgroundColor: "#A8ADF8"
  },
  smallIconGreen: {
    backgroundColor: "#18CF7A"
  },
  smallIconOrange: {
    backgroundColor: "#F2A068"
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    padding: 22,
    ...shadowCard
  },
  planTitle: {
    color: "#050505",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 34,
    marginTop: 12
  },
  planBody: {
    color: "#77777A",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 10
  },
  reasonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16
  },
  reasonChip: {
    backgroundColor: "#DDF7E9",
    borderRadius: 14,
    color: "#0AA66F",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  planActions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 18
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#18CF7A",
    borderRadius: 21,
    flex: 1.2,
    flexDirection: "row",
    gap: 7,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#F2F4F3",
    borderRadius: 21,
    flex: 1,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  secondaryButtonText: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  ghostButton: {
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderRadius: 21,
    borderWidth: 1,
    flex: 1,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  ghostButtonText: {
    color: "#77777A",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    ...shadowCard
  },
  feedbackHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  feedbackTitle: {
    color: "#050505",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 28
  },
  feedbackBody: {
    color: "#77777A",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 12
  },
  feedbackActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  feedbackButton: {
    alignItems: "center",
    backgroundColor: "#DDF7E9",
    borderRadius: 20,
    flex: 1,
    height: 40,
    justifyContent: "center"
  },
  feedbackButtonActive: {
    backgroundColor: "#18CF7A"
  },
  feedbackButtonText: {
    color: "#0AA66F",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  feedbackButtonTextActive: {
    color: "#FFFFFF"
  },
  feedbackButtonSecondary: {
    alignItems: "center",
    backgroundColor: "#F5F2EF",
    borderRadius: 20,
    flex: 1,
    height: 40,
    justifyContent: "center"
  },
  feedbackButtonDanger: {
    backgroundColor: "#D86C4D"
  },
  feedbackButtonSecondaryText: {
    color: "#D36A2C",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  },
  buttonPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }]
  },
  softPressed: {
    opacity: 0.7
  }
});
