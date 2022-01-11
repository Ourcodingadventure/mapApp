import React from 'react';
import { View, StyleSheet, Button, TouchableOpacity } from 'react-native'
import Colors from '../config/Colors';
import AppText from './text/AppText';

function AppButton({ title, onPress, height = 55, width = '100%', backgroundColor = Colors.purple, buttonFontStyle, style }) {
    return (

        <TouchableOpacity style={[styles.container, { height, width, backgroundColor }, style]} onPress={onPress} >
            <AppText style={[{ color: 'white', letterSpacing: 3 }, buttonFontStyle,]} numberOfLines={1}>
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
        backgroundColor: Colors.purple,
        borderRadius: 50,
        height: 60,
        fontSize: 100,
    },
})
export default AppButton;