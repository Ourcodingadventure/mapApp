import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from "../config/Colors";

function ComplainButton({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <MaterialCommunityIcons
                    name="plus-circle"
                    color={'white'}
                    size={40}
                />

            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: Colors.primaryLight,
        borderColor: 'white',
        borderRadius: 40,
        borderWidth: 10,
        bottom: 30,
        height: 80,
        justifyContent: "center",
        width: 80,
    },
});

export default ComplainButton;