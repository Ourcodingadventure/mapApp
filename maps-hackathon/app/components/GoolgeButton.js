import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppText from './text/AppText';

function GoogleButton({ title, onPress, width = '98%', buttonFontStyle, style }) {
    return (
        <TouchableOpacity style={[styles.container, { width }, style]} onPress={onPress} >
            <MaterialCommunityIcons
                name='google'
                size={24}
                style={styles.icon}
                color='white'
            />
            <AppText style={[buttonFontStyle, styles.btnText]}>Google</AppText>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#4285F4',
        borderRadius: 20,
        height: 40,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    btnText: {
        color: 'white',
        fontWeight: '600',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    icon: {
        paddingLeft: 14,
        left: 1,
        position: 'absolute'
    }
})
export default GoogleButton;