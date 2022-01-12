import React from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../config/Colors";

const Header = () => {
  return <View style={styles.card}></View>;
};

export default Header;
const styles = StyleSheet.create({
  card: {
    paddingTop: 10,
    overflow: "hidden",
    backgroundColor: Colors.semiTransparentWhite,
    width: "97%",
    height: 100,
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 5,
  },
});
