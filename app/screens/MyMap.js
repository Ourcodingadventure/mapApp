/** @format */

import React, { useState, useEffect, useContext } from 'react';
import MapView from 'react-native-maps';
import { View, StyleSheet, Dimensions, Text, TextInput } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import socket from '../config/socket';
import environment from '../config/environment/environment';
import useLocation from '../hooks/useLocation';
import AppText from '../components/text/AppText';
import AuthContext from '../Context/AuthContext';
import axios from 'axios';
export default function MyMap({ navigation, route }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstCall, setFirstCall] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { location, fetching } = useLocation();
  const [openComment, setOpenComment] = useState(false);
  const { coords, setCoords, change, setChange } = useContext(AuthContext);

  const getFeedComplains = async () => {
    if (firstCall) {
      setLoading(true);
      setFirstCall(false);
    }
    try {
      let data = await axios.get(`${environment.baseUrl}/all-complains`);
      setFeed(data.data.complain.reverse());
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedComplains();
    socket.on('complain', () => {
      setChange(!change);
    });
    return () => {
      socket.off('complain');
    };
  }, []);

  const handleAddMarker = (e) => {
    const markerCoords = e.nativeEvent.coordinate;
    setCoords(markerCoords);
    navigation.navigate('PostComplainTab');
  };

  return (
    <View style={styles.container}>
      <AppText>Loading</AppText>
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onPress={handleAddMarker}
        >
          {feed.map((mark) => {
            return (
              <Marker
                key={mark._id}
                coordinate={{
                  latitude: mark.latitude,
                  longitude: mark.longitude,
                }}
                title={mark.issueName}
                description={mark.remarks}
              />
            );
          })}
        </MapView>
      )}
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
  distance = distance / 2;
  const circumference = 40075;
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
  const angularDistance = distance / circumference;

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
  const longitudeDelta = Math.abs(
    Math.atan2(
      Math.sin(angularDistance) * Math.cos(lat),
      Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)
    )
  );

  return (result = {
    latitude: lat,
    longitude: lon,
    latitudeDelta,
    longitudeDelta,
  });
}
