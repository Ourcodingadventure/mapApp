import React from 'react';
import { StyleSheet } from 'react-native'
import AppText from './AppText';

function H2({ children, style }) {
    return (
        <AppText style={[styles.text, style]}>{children}</AppText>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 26,
        fontWeight: "500",
    },
})
export default H2