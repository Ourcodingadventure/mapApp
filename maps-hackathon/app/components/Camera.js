import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import AppText from './text/AppText';
import colors from '../config/Colors';
import { MaterialCommunityIcons, } from '@expo/vector-icons';


export default function AppCamera({ imageUri, onChangeImage }) {
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const cameraRef = React.useRef();

    const getCameraPermission = async () => {
        const result = await Camera.requestPermissionsAsync()
        try {
            if (result.status !== 'granted') return alert("You need to enable camera's permission to capture complain's image ")
            return setCamera(true);
        }
        catch (error) {
            console.log('error');
        }
    }
    const capturePicture = async () => {
        setLoading(true)
        const data = await cameraRef.current.takePictureAsync();
        try {
            onChangeImage(data)
            setModalVisible(false)
            setLoading(false);
        }
        catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        getCameraPermission();
    }, [])

    const handlePress = () => {
        capturePicture();
    }
    if (!camera) return (
        <TouchableOpacity >
            <MaterialCommunityIcons name='camera' color={'black'} size={50} style={{ alignSelf: 'center' }} />
            <Text style={{ alignSelf: 'center' }}>Enable Camera's permission</Text>
        </TouchableOpacity>
    )
    return (
        <React.Fragment>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons name='camera' color={'black'} size={50} style={{ alignSelf: 'center' }} />
                <Text style={{ alignSelf: 'center' }}>Capture from camera</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible}
                animationType='slide'
            >
                <Camera type={type} style={styles.camera}
                    ref={cameraRef}
                >

                    <View style={styles.cameraSetting}>
                        <TouchableOpacity
                            onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}
                        >

                            <MaterialCommunityIcons name='camera-retake' color={'white'} size={50} />
                            <Text style={styles.cameraText}>Flip</Text>
                        </TouchableOpacity>
                        {!loading ?
                            <TouchableOpacity
                                onPress={capturePicture}
                            >
                                <MaterialCommunityIcons name='camera' color={'white'} size={50} />
                                <Text style={styles.cameraText}>Capture</Text>
                            </TouchableOpacity> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Fetching location....</Text>
                        }


                        <TouchableOpacity

                            onPress={() => {
                                setModalVisible(false);
                                setLoading(false)
                            }}
                        >
                            <MaterialCommunityIcons name='close' color={'white'} size={50} />
                            <Text style={styles.cameraText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                </Camera>


            </Modal>


        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.light,
        borderRadius: 15,
        justifyContent: 'center',
        height: 100,
        width: 100,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    cameraSetting: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-around'
    },
    cameraText: {
        color: 'white',
        textAlign: 'center'
    }
})