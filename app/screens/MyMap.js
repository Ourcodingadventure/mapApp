<<<<<<< HEAD:map-app-front/app/screens/MyMap.js
/** @format */

import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Marker } from 'react-native-maps';
import socket from '../config/socket';
import useLocation from '../hooks/useLocation';
import AppText from '../components/text/AppText';
import { v4 as uuidv4 } from 'uuid';
=======
import React, { useState, useEffect } from "react";
import MapView from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import { Marker } from "react-native-maps";
import socket from "../config/socket";
import environment from "../config/environment/environment";
import useLocation from "../hooks/useLocation";
import AppText from "../components/text/AppText";
import axios from "axios";
>>>>>>> c45bab882800736b97a3325153f421020cc5c94c:app/screens/MyMap.js
export default function MyMap({ navigation, route }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);
  const [firstCall, setFirstCall] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markerArray, setMarkerArray] = useState([]);
  const { location, fetching } = useLocation();

  const getFeedComplains = async () => {
    if (firstCall) {
      console.log("hi");
      setLoading(true);
      setFirstCall(false);
    }
    try {
      console.log("hi in try");
      let data = await axios.get(`${environment.baseUrl}/all-complains`);

      setFeed(data.data.complain.reverse());
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD:map-app-front/app/screens/MyMap.js
  const handleAddMarker = (e) => {
    const markerCoords = e.nativeEvent.coordinate;
    const newMarkerArray = [...markerArray];
    newMarkerArray.push(markerCoords);
    setMarkerArray(newMarkerArray);
    console.log('marker', markerArray, markerArray.length);
  };

=======
>>>>>>> c45bab882800736b97a3325153f421020cc5c94c:app/screens/MyMap.js
  useEffect(() => {
    getFeedComplains();
    socket.on('complain', () => {
      setChange(!change);
    });

    return () => {
      socket.off('complain');
    };
<<<<<<< HEAD:map-app-front/app/screens/MyMap.js
  }, [change]);

=======
  }, []);
  //todo
>>>>>>> c45bab882800736b97a3325153f421020cc5c94c:app/screens/MyMap.js
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
          onPress={(e) => handleAddMarker(e)}
        >
<<<<<<< HEAD:map-app-front/app/screens/MyMap.js
          {markerArray.map((marker) => (
            <Marker
              key={Math.random()}
              coordinate={marker}
              //  title={organization}
              //  description={status}
            />
          ))}
=======
          {console.log(feed)}

          {feed.map((mark) => {
            return (
              <Marker
                coordinate={{
                  latitude: mark.latitude,
                  longitude: mark.longitude,
                }}
                title={mark.issueName}
                description={mark.remarks}
              />
            );
          })}
>>>>>>> c45bab882800736b97a3325153f421020cc5c94c:app/screens/MyMap.js
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
