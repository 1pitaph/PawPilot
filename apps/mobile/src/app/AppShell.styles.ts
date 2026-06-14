import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    backgroundColor: "#F8F8F4",
    flex: 1
  },
  safeArea: {
    backgroundColor: "#F7E8D5",
    flex: 1,
    zIndex: 2
  },
  mapLayer: {
    backgroundColor: "#D6E8E5",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  mapLayerHidden: {
    zIndex: 0
  },
  mapLayerVisible: {
    zIndex: 1
  }
});
