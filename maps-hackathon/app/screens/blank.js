import React from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import Screen from "../components/Screen";

export default function Blank(props) {
  return (
    <Screen syle={styles.container}>
      <Text>Welcome</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
});
