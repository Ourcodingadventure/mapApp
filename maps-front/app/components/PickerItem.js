import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import Text from "./text/AppText";

function PickerItem({ item, onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text: {
        padding: 20,
    },
});

export default PickerItem;