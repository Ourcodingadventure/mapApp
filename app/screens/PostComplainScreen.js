/** @format */

import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import AppText from "../components/text/AppText";
import H3 from "../components/text/H2";
import { authStyle } from "../config/styles";
import axios from "axios";
import environment from "../config/environment/environment";
import ErrorMessage from "../components/form/ErrorMessage";
import Colors from "../config/Colors";
import Picker from "../components/Picker";
import Button from "../components/Button";
import Input from "../components/Input";
import ImageInput from "../components/ImageInput";
import Camera from "../components/Camera";
import useLocation from "../hooks/useLocation";
import Screen from "../components/Screen";
import AuthContext from "../Context/AuthContext";

export default function PostComplainScreen({ navigation }) {
  const [error, setError] = useState(false);

  const [selectedOrganization, setSelectedOrganization] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [imageUri, onChangeImage] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [category, setCategory] = useState([
    { name: "Patholes", id: 1 },
    { name: "Pavement issue", id: 2 },
    { name: "Sewerage", id: 3 },
    { name: "Garbage", id: 4 },
    { name: "Street Light Outage", id: 5 },
    { name: "Illegal Parking", id: 6 },
    { name: "Violent Animals", id: 7 },
  ]);
  const { location, fetching } = useLocation();
  const { coords, setCoords, change, setChange } = useContext(AuthContext);

  const handleSubmit = async () => {
    let localUri;
    let filename;
    let match;
    let type;
    let photo;
    let mandatoryData;
    var form = new FormData();
    {
      coords
        ? (mandatoryData = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            altitude: null,
            message: message,
            category: selectedItem,
            locationText: locationText,
            anonymous,
          })
        : (mandatoryData = {
            latitude: location ? location.latitude : null,
            longitude: location ? location.longitude : null,
            altitude: location ? location.altitude : null,
            message: message,
            category: selectedItem,
            locationText: locationText,
            anonymous,
          });
    }

    if (imageUri) {
      localUri = imageUri.uri;
      filename = localUri.split("/").pop();
      match = /\.(\w+)$/.exec(filename);
      type = match ? `image/${match[1]}` : `image`;
      photo = {
        uri: localUri,
        type,
        name: filename,
        ...mandatoryData,
      };
      form.append("complain-photo", photo);
    }
    form.append("dataa", JSON.stringify(mandatoryData));

    setLoading(true);
    fetch(environment.baseUrl + "/complain", {
      body: form,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .catch((error) => {})
      .then((responseData) => {
        setLoading(false);
        setSelectedItem(false);
        onChangeImage(null);
        setMessage("");
        setLocationText("");
        setError(false);
        setAnonymous(false);
        setGallery(false);
        setSelectedOrganization(false);
        setChange(!change);
        alert("Your complain has been placed successfully", responseData);
      });
  };
  const setFromGallery = (item) => {
    onChangeImage(item);
    setGallery(true);
  };
  const setFromCamera = (uri) => {
    onChangeImage(uri);
    setGallery(false);
  };
  useEffect(() => {
    if (!imageUri) {
      setGallery(false);
    }
  }, [imageUri]);

  return (
    <View style={styles.screen}>
      <Screen>
        <ScrollView style={styles.container}>
          <H3 style={styles.header}>ADD A WARNING</H3>
          <View style={styles.division}></View>
          <Text style={styles.point1}>POINT 1</Text>

          <View style={styles.flexBetween}>
            <Text style={styles.problem}>PROBLEM</Text>
            <View>
              <Picker
                style={styles.picker}
                items={category}
                selectedItem={selectedItem}
                onSelectItem={(item) => setSelectedItem(item)}
              />
            </View>
          </View>

          <View style={styles.division2}></View>

          <AppText style={styles.description}>DESCRIPTION</AppText>
          <Input
            style={styles.message}
            placeholder="Describe the problem..."
            numberOfLines={4}
            value={message}
            onChangeText={(e) => setMessage(e)}
          />

          <View style={styles.flexBetween}>
            <AppText style={styles.addAPicture}>ADD A PICTURE</AppText>
            <Camera
              style={styles.image}
              imageUri={imageUri}
              onChangeImage={(uri) => setFromCamera(uri)}
            />
          </View>
          <ImageInput
            style={styles.image}
            imageUri={imageUri}
            onChangeImage={(uri) => setFromGallery(uri)}
          />

          <View style={styles.division3}></View>

          <ErrorMessage
            visible={error}
            error={error}
            style={{ textAlign: "center", marginTop: 30 }}
          />

          <View style={styles.registerBtn}>
            {!loading && !fetching ? (
              <Button title="POST" onPress={handleSubmit} />
            ) : (
              <ActivityIndicator color={!fetching ? Colors.primary : "white"} />
            )}
          </View>

          <Text style={styles.anonim} onPress={() => setAnonymous(!anonymous)}>
            {anonymous ? "ANONYMOUS MODE" : "NOT ANONYMOUS MODE"}
          </Text>

          {(!fetching && !location) ||
            (gallery && (
              <React.Fragment>
                {/* <AppText>Location</AppText> */}
                <Input
                  value={locationText}
                  onChangeText={(e) => setLocationText(e)}
                />
              </React.Fragment>
            ))}
        </ScrollView>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.white,
    height: "100%",
  },
  container: {
    borderRadius: 20,
    backgroundColor: Colors.white,
    height: "100%",
  },
  header: {
    color: Colors.black,
    marginTop: 30,
    marginLeft: 30,
    fontSize: 18,
    letterSpacing: 3,
    fontWeight: "700",
  },
  name: {
    marginLeft: 30,
    color: Colors.white,
    marginTop: 30,
    fontSize: 25,
    letterSpacing: 3,
    fontWeight: "600",
  },
  division: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Colors.grey,
    height: 1,
    width: "100%",
  },
  division2: {
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: Colors.grey,
    height: 1,
    width: "100%",
  },
  division3: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: Colors.grey,
    height: 1,
    width: "100%",
  },
  flex: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 30,
  },
  email: {
    paddingTop: 3,
    marginLeft: 20,
    color: Colors.white,
    fontSize: 15,
    letterSpacing: 2,
  },
  password: {
    paddingTop: 9,
    marginLeft: 20,
    color: Colors.white,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "600",
  },
  flexBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingRight: 30,
    paddingLeft: 30,
  },
  problem: {
    letterSpacing: 2,
    fontSize: 14,
  },
  picker: {
    color: "#FFF",
    backgroundColor: "grey",
    paddingRight: 33,
    paddingLeft: 23,
    borderRadius: 30,
    fontSize: 16,
    borderWidth: 0,
  },
  point1: {
    color: "#6C7B8AFF",
    marginLeft: 28,
    fontSize: 23,
    letterSpacing: 2,
  },
  description: {
    fontSize: 14,
    marginLeft: 30,
    letterSpacing: 2,
    marginBottom: 15,
  },
  addAPicture: {
    paddingTop: 10,
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 15,
  },
  message: {
    color: "black",
    fontSize: 16,
  },
  image: {},
  registerBtn: {
    alignSelf: "center",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 10,
    marginTop: 30,
    paddingRight: 30,
    paddingLeft: 30,
  },
  anonim: {
    fontSize: 15,
    alignSelf: "center",
    justifyContent: "flex-end",
    color: "#6C7B8AFF",
    fontSize:13,

  },
});
