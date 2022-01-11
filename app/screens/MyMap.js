import React, { useState, useEffect } from "react";
import MapView, { Polyline } from "react-native-maps";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import socket from "../config/socket";
import environment from "../config/environment/environment";
import useLocation from "../hooks/useLocation";
import AppText from "../components/text/AppText";
import axios from "axios";
import pick from "lodash/pick";
import * as Location from "expo-location";
Location.installWebGeolocationPolyfill();

export default function MyMap() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [change, setChange] = useState(false);
  const [firstCall, setFirstCall] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markerArray, setMarkerArray] = useState([]);
  const [route, setRoute] = useState([]);
  const { location, fetching } = useLocation();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {},
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    const watchID = navigator.geolocation.watchPosition((position) => {
      const positionLatLngs = pick(position.coords, ["latitude", "longitude"]);
      console.log();
      setRoute((prev) => [...prev, positionLatLngs]);
    });
    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  }, []);
  console.log("route", route);
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

  const handleAddMarker = (e) => {
    const markerCoords = e.nativeEvent.coordinate;
    const newMarkerArray = [...markerArray];
    newMarkerArray.push(markerCoords);
    setMarkerArray(newMarkerArray);
    console.log("marker", markerArray, markerArray.length);
  };
  useEffect(() => {
    getFeedComplains();
    socket.on("complain", () => {
      setChange(!change);
    });

    return () => {
      socket.off("complain");
    };
  }, []);
  //todo
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
          followUserLocation={true}
          overlays={[
            {
              coordinates: route,
              strokeColor: "#19B5FE",
              lineWidth: 1000,
            },
          ]}
          onPress={(e) => handleAddMarker(e)}
        >
          <Polyline coordinates={route} strokeWidth={5} />
          {markerArray.map((marker) => (
            <Marker
              key={Math.random()}
              coordinate={marker}
              //  title={organization}
              //  description={status}
            />
          ))}
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
      {/* start tracing */}
      <Image
        style={styles.iconGo}
        source={require("../assets/icons/go-button.png")}
      />

      {/* start tracing */}

      <MaterialCommunityIcons
        style={styles.iconGo}
        name="play"
        color="white"
        size={60}
      />

      {/* show these 2 while tracing */}

      {/* <MaterialCommunityIcons style={styles.iconStop} name="stop" color="white" size={60} /> */}

      {/* stop tracing */}

      {/* <MaterialCommunityIcons style={styles.iconSave} name="plus" color="white" size={60} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  iconGo: {
    position: "absolute",
    bottom: 50,
    right: 40,
  },
  iconStop: {
    position: "absolute",
    bottom: 50,
    right: 40,
  },
  iconSave: {
    position: "absolute",
    bottom: 140,
    right: 40,
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
