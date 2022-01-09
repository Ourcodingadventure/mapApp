import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Alert } from 'react-native'
import colors from '../config/Colors';
import { MaterialCommunityIcons, } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

function ImageInput({ imageUri, onChangeImage }) {

    React.useEffect(() => {
        requestPermission();
    }, [])
    const requestPermission = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync()
    }

    const handlePress = () => {
        if (!imageUri) selectImage();
        else Alert.alert('Delete', 'are you sure you want to delete this image', [
            { text: 'yes', onPress: () => onChangeImage(null) },
            { text: 'No' }

        ])
    }

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [1, 1],
                quality: 0.1,
            })
            if (!result.cancelled) onChangeImage(result);
        } catch (error) {

        }
    }
    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                {!imageUri && <MaterialCommunityIcons name='camera' size={35} color={colors.medium} />}
                {imageUri && <Image style={styles.image} source={{ uri: imageUri.uri }} />}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.light,
        borderRadius: 15,
        justifyContent: 'center',
        height: 80,
        width: 100,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
    }
})

export default ImageInput;