import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Colors from "../config/Colors";

function ComplainButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.plus}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.pink,
    borderRadius: 10,
    top: 5,
    height: 36,
    justifyContent: "center",
    width: 80,
  },
  plus: {
    alignItems: "center",
    color: Colors.semiTransparentWhite,
  },
});

export default ComplainButton;
