import React, { useState, useEffect, useContext } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  ImageBackground,
  Text,
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
import Colors from "../config/Colors";
import Loader from "../components/Loader";

Location.installWebGeolocationPolyfill();

export default function MyMap({ navigation }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translation, setTranslation] = useState(0);
  const [firstCall, setFirstCall] = useState(true);
  const [route, setRoute] = useState([]);
  const [track, setTrack] = useState(false);
  const { location, fetching } = useLocation();
  const { coords, setCoords, change, setChange, user } =
    useContext(AuthContext);

  useEffect(() => {
    let watchID;
    if (track) {
      navigator.geolocation.getCurrentPosition(
        (position) => {},
        (error) => alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      watchID = navigator.geolocation.watchPosition((position) => {
        const positionLatLngs = pick(position.coords, [
          "latitude",
          "longitude",
        ]);

        setRoute((prev) => [...prev, positionLatLngs]);
      });
    }
    return () => {
      navigator.geolocation.clearWatch(watchID);
      setRoute([]);
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
      {fetching && (
        <Loader style={styles.loader} source={require("../assets/giphy.gif")} />
      )}
      {!fetching && (
        <View style={styles.flexBetween}>
          <Text style={styles.headway}>HEADWAY </Text>

          {!track ? (
            <MaterialCommunityIcons
              name="play"
              color={"white"}
              size={50}
              style={styles.tracingButton}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
              onPress={() => setTrack(true)}
            />
          ) : (
            <>
              <React.Fragment>
                <MaterialCommunityIcons
                  name="stop"
                  color={"white"}
                  size={50}
                  style={styles.tracingButton}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                  }}
                  onPress={() => setTrack(false)}
                />

                <MaterialCommunityIcons
                  name="plus"
                  color={"white"}
                  size={50}
                  style={styles.tracingButton}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                  }}
                  onPress={(e) => handleAddMarker(e)}
                />
              </React.Fragment>
            </>
          )}
        </View>
      )}

      {location && !fetching && (
        <MapView
          userLocationAnnotationTitle={user.name}
          showsMyLocationButton={true}
          showsBuildings={true}
          showsCompass={true}
          style={styles.map}
          initialRegion={{
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
          onLongPress={(e) => handleAddMarker(e)}
        >
          {track && <Polyline coordinates={route} strokeWidth={5} />}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  card: {
    backgroundColor: Colors.purple,
    width: "100%",
    height: 110,
  },
  headway: {
    fontSize: 50,
    fontStyle: "italic",
    fontFamily: "sans-serif",
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    textShadowColor: Colors.darkPurple,
    textShadowRadius: 4,
    textShadowOffset: { width: 4, height: 4 },
  },
  flexBetween: {
    backgroundColor: Colors.purple,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 20,
    height: 110,
  },
  loader: {
    position: "absolute",
    // left: 0,
    right: 0,
    height: 60,
    width: 60,
    textAlign: "center",
  },
  tracingButton: {
    paddingTop: 3,
    paddingLeft: 5,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 30,
  },
  map: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  iconGo: {},
  iconStop: {},
  iconSave: {},

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
