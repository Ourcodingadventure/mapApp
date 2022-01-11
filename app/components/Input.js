import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import colors from '../config/Colors';
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function SearchInput({ inputContainerStyle, CustomIcon, inputStyle, onChangeText, iconName, iconSize = 20, color = 'gray', iconStyle, placeholder = '', value, ...otherProps }) {
    const [showIcon, setShowIcon] = React.useState(true);
    const [secureTextEntry, setSecureTextEntry] = useState(otherProps.secureTextEntry);
    return (
        <View style={[styles.container, inputStyle, inputContainerStyle]}>
            {showIcon && iconName && <EvilIcons name={iconName} size={iconSize} color={color} style={[styles.icon, iconStyle]} />}
            {showIcon && CustomIcon && <CustomIcon />}
            <TextInput placeholder={placeholder} style={[styles.input, inputStyle]} onChangeText={onChangeText}
                onBlur={() => setShowIcon(true)}
                onFocus={() => setShowIcon(false)}
                value={value}
                {...otherProps}
                placeholderTextColor='lightgrey'
                secureTextEntry={secureTextEntry}
            />
            {otherProps.secureTextEntry &&
                (<TouchableWithoutFeedback onPress={() => setSecureTextEntry(!secureTextEntry)} style={{ justifyContent: 'flex-end', alignSelf: 'flex-end', alignItems: 'flex-end' }}>
                    {secureTextEntry ? <MaterialCommunityIcons name='eye-off' size={iconSize} color={color} style={[styles.icon, iconStyle, { paddingRight: 5, paddingLeft: 0 }]} />
                        : <MaterialCommunityIcons name='eye' size={iconSize} color={color} style={[styles.icon, iconStyle, { paddingRight: 5, paddingLeft: 0, justifyContent: 'flex-end' }]} />
                    }


                </TouchableWithoutFeedback>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 10,
        borderColor: "#F5F5F5",
        height: 40,
        marginVertical: 5,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    input: {
        width: '100%',
        paddingLeft: 10,
        color: colors.primary,
        fontWeight: "500",
        flex: 1
    },
    icon: {
        alignSelf: 'center',
        fontWeight: "500",
    }

})

