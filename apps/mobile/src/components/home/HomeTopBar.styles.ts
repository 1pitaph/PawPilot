import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 58
  },
  userAvatar: {
    backgroundColor: "#A5B2FF",
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 23,
    borderWidth: 2,
    height: 46,
    overflow: "hidden",
    width: 46
  },
  userAvatarImage: {
    height: "100%",
    width: "100%"
  },
  searchPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.66)",
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 52,
    minWidth: 0,
    paddingHorizontal: 14
  },
  searchText: {
    color: "#9398AA",
    flex: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  signalPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    height: 52,
    justifyContent: "center",
    paddingHorizontal: 11
  },
  signalText: {
    color: "#26358F",
    fontSize: 19,
    fontWeight: "900"
  },
  assistantButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  softPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.98 }]
  }
});
