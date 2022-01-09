import React from "react";
import { StyleSheet } from "react-native";

import Text from "../text/AppText";

function ErrorMessage({ error, visible, style }) {
    if (!visible || !error) return null;

    return <Text style={[styles.error, style]}>{error}</Text>;
}

const styles = StyleSheet.create({
    error: { color: "red", fontSize: 12 },
});

export default ErrorMessage;