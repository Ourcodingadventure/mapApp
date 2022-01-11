import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Marker } from 'react-native-maps';

export default function MapScreen({ navigation, route }) {
    let { latitude, longitude, postedBy, organization, status, name } = route.params


    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={
                    {
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }
                }
                showsUserLocation={true}

            >
                <Marker
                    coordinate={{
                        latitude,
                        longitude,
                    }}
                    title={organization}
                    description={status}
                />
            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

function regionFrom(lat, lon, distance) {
    distance = distance / 2
    const circumference = 40075
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000
    const angularDistance = distance / circumference

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
    const longitudeDelta = Math.abs(Math.atan2(
        Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

    return result = {
        latitude: lat,
        longitude: lon,
        latitudeDelta,
        longitudeDelta,
    }
}