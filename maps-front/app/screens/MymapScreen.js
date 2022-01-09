import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
const height = Dimensions.get("window").height;
const Map = () => {
  return (
    <MapView
      style={styles.map}
      loadingEnabled={true}
      region={{
        latitude: 32.05334741125251,
        longitude: 34.772092084657935,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
    >
      <MapView.Marker
        coordinate={{
          latitude: 32.05334741125251,
          longitude: 34.772092084657935,
        }}
        title={"ITC"}
        description={school}
      ></MapView.Marker>
    </MapView>
  );
};
const styles = StyleSheet.create({
  map: {
    height,
  },
});
export default Map;
// 32.05334741125251, 34.772092084657935
