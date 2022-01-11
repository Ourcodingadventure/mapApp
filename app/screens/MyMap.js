import React, { useState, useEffect, useContext } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";

import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  ImageBackground,
} from "react-native";
import socket from "../config/socket";
import environment from "../config/environment/environment";
import useLocation from "../hooks/useLocation";
import AppText from "../components/text/AppText";
import axios from "axios";
import pick from "lodash/pick";
import * as Location from "expo-location";
import AppButton from "../components/Button";
import AuthContext from "../Context/AuthContext";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import ComplainButton from "../components/ComplainButton";
import PostButton from "../components/PostButton";
Location.installWebGeolocationPolyfill();

export default function MyMap({ navigation }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [change, setChange] = useState(false);
  const [firstCall, setFirstCall] = useState(true);
  const [route, setRoute] = useState([]);
  const [track, setTrack] = useState(false);
  const { location, fetching } = useLocation();
  const { coords, setCoords, change, setChange } = useContext(AuthContext);
  useEffect(() => {
    if (track) {
      navigator.geolocation.getCurrentPosition(
        (position) => {},
        (error) => alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      const watchID = navigator.geolocation.watchPosition((position) => {
        const positionLatLngs = pick(position.coords, [
          "latitude",
          "longitude",
        ]);

        setRoute((prev) => [...prev, positionLatLngs]);
      });
    }
    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  }, [track]);
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
    setCoords(markerCoords);
    navigation.navigate("PostComplainTab");
  };
  useEffect(() => {
    getFeedComplains();
    socket.on("complain", () => {
      setChange(!change);
    });

    return () => {
      socket.off("complain");
    };
  }, [change]);
  //todo
  return (
    <View style={StyleSheet.absoluteFillObject}>
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
          // onRegionChange={}
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

      {!track ? (
        <PostButton
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          style={styles.iconGo}
          source={require("../assets/icons/go-button.png")}
          onPress={() => setTrack(true)}
        />
      ) : (
        <>
          <React.Fragment>
            <PostButton
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              style={styles.iconStop}
              source={require("../assets/icons/stop-button.png")}
              onPress={() => setTrack(false)}
            />
            <PostButton
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              style={styles.iconSave}
              source={require("../assets/icons/save-location-button.png")}
              onPress={(e) => handleAddMarker(e)}
            />
          </React.Fragment>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: Dimensions.get("window").width,
    flex: 1,
    // height: Dimensions.get("window").height,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  iconGo: {
    position: "absolute",
    bottom: 50,
    right: 40,
    zIndex: 9999999,
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

  button: {
    backgroundColor: "#DDDDDD",
    marginTop: 200,
    padding: 30,
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

// <View style={styles.footer}>
// {!track ? (
//   <Button title="start" onPress={() => setTrack(true)}>
//     <Image
//       style={styles.iconGo}
//       source={require("../assets/icons/go-button.png")}
//     />
//   </Button>
// ) : (
//   <React.Fragment>
//     {/* <Image
//   style={styles.iconStop}
//   source={require("../assets/icons/stop-button.png")}
//   onPress={setTrack(false)}
// /> */}
//     <Image
//       style={styles.iconSave}
//       source={require("../assets/icons/save-location-button.png")}
//     />
//   </React.Fragment>
// )}
// </View>
{
  /* <View>
            <TouchableOpacity onPress={() => Alert.alert("image clicked")}>
              <TouchableOpacity
                onTouchEnd={(e) => {
                  e.stopPropagation();
                }}
              >
                <Image
                  source={require("../assets/icons/go-button.png")}
                  style={styles.button}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View> */
}
