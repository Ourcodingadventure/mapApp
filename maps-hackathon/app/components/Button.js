import React from 'react';
import { View, StyleSheet, Button, TouchableOpacity } from 'react-native'
import Colors from '../config/Colors';
import AppText from './text/AppText';

function AppButton({ title, onPress, width = '98%', backgroundColor = Colors.primary, buttonFontStyle, style }) {
    return (

        <TouchableOpacity style={[styles.container, { width, backgroundColor }, style]} onPress={onPress} >
            <AppText style={[{ color: 'white' }, buttonFontStyle,]} numberOfLines={1}>
                {title}
            </AppText>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 20,
        height: 40,
    },
})
export default AppButton;