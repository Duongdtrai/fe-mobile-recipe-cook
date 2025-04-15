import { StyleSheet } from "react-native";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

export const DEFAULT_CSS = StyleSheet.create({
  loading: {
    width: 80,
    height: 80,
    position: "absolute",
    top: -20,
    left: "50%",
    zIndex: 1,
  },
});
