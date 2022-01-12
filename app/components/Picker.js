import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Modal,
    FlatList
} from 'react-native';
import colors from '../config/Colors';
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../config/Colors';
import Button from './Button';
import Screen from './Screen'
import PickerItem from './PickerItem';
import AppText from './text/AppText';



export default function Picker({ onPress, selectedItem, onSelectItem, inputContainerStyle, CustomIcon, inputStyle, onChangeText, iconName, iconSize = 20, color = 'gray', iconStyle, placeholder = '', items, ...otherProps }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [value, setValue] = useState();
    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                <View style={[styles.container, inputStyle, inputContainerStyle]}>
                    <TextInput placeholder={placeholder} style={[styles.input, inputStyle]} onChangeText={onChangeText}
                        value={value}
                        onFocus={() => setModalVisible(true)}
                        {...otherProps}
                        placeholderTextColor='lightgrey'
                        placeholder={selectedItem ? selectedItem.name : 'Choose category'}
                    />
                    <MaterialCommunityIcons
                        name='chevron-down' color={Colors.primary}
                        size={24}
                        style={[styles.icon, iconStyle, { paddingRight: 5, paddingLeft: 0, justifyContent: 'flex-end' }]}
                    />
                </View>
            </TouchableWithoutFeedback>
            <Modal visible={modalVisible}
                animationType='slide'
            >
                <Screen style={styles.modal}>
                    <Button title='Close' onPress={() => setModalVisible(false)} />
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            return (
                                <PickerItem item={item} onPress={() => {
                                    onSelectItem(item);
                                    setModalVisible(false)
                                }} />

                            )
                        }}
                    />

                </Screen>
            </Modal>
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingLeft: 10,
        borderColor: "#F5F5F5",
        height: 40,
        marginVertical: 5,
        borderWidth: 0,
        borderColor: colors.primary,
    },
    input: {
        width: '100%',
        paddingLeft: 10,
        fontWeight: "500",
        flex: 1,
        color: "#FFFFFFFF",
    },
    icon: {
        position: "absolute",
        right: 3,
        bottom: 7,
        color: "rgba(255,255,255, 0.8)",
    }
    ,
    modal: {
        padding: 30,
        flex: 1,
        justifyContent: 'center',
    },

})

