import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import Screen from "./Screen";

function Loader({ source }) {
  const translation = useRef(new Animated.Value(300)).current;
  useEffect(() => {
    Animated.timing(translation, {
      toValue: -300,
      useNativeDriver: true,
    }).start();
    // return()=>
  }, []);
  return (
    <View style={styles.container}>
      <Animated.Image
        style={{
          height: 60,
          width: 60,
          transform: [{ translateX: translation }],
        }}
        source={source}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});
export default Loader;
