import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import Colors from "../config/Colors";

function PostButton({ onPress, style, source, onTouchEnd }) {
  return (
    <TouchableOpacity onPress={onPress} onTouchEnd={onTouchEnd}>
      <Image style={style} source={source} />
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
    width: 70,
    marginLeft: 10,
    marginRight: 10,
  },
  plus: {
    alignItems: "center",
    color: Colors.semiTransparentWhite,
  },
});

export default PostButton;
