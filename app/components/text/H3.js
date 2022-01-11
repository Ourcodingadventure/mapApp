import React from 'react';
import { StyleSheet } from 'react-native'
import AppText from './AppText';

function H3({ children, style }) {
    return (
        <AppText style={[styles.text, style]}>{children}</AppText>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: "500",
    },
})
export default H3