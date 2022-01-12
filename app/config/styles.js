import { Platform, StyleSheet } from "react-native";

import colors from "./Colors";

export default {
  colors,
  text: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
};

const authStyle = StyleSheet.create({
  flexElements: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexElementsShort: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  btnLabel: {
    color: colors.transparentWhite,
    fontSize: 11,
    letterSpacing: 2,
  },
  or: {
    color: colors.semiTransparentWhite,
    fontSize: 13,
    alignSelf: "center",
    padding: 10,
  },
  divider: {
    height: 1,
    width: 50,
    backgroundColor: colors.barelySeenWhite,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 30,
    paddingTop: 100,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 0,
    backgroundColor: "rgba(51,48,49, 0.35)",
    height: 60,
    borderRadius: 11,
  },
  registerBtn: {
    alignSelf: "center",
    justifyContent: "flex-end",
    padding: 30,
    width: "100%",
    marginBottom: 20,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});

export { authStyle };
