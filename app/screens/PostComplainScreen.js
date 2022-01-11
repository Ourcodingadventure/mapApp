import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  FlatList,
  StyleSheet,
  Modal,
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

export default function PostComplainScreen({ navigation }) {
  const [error, setError] = useState(false);
  // const [organization, setOrganization] = useState([]);
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

  const getOrganization = async () => {
    let data = await axios.get(`${environment.baseUrl}/organization`);
    setOrganization(data.data.organization);
  };

  useEffect(() => {
    getOrganization();
  }, []);

  const handleSubmit = async () => {
    let localUri;
    let filename;
    let match;
    let type;
    let photo;
    var form = new FormData();
    let mendatoryData = {
      latitude: location ? location.latitude : null,
      longitude: location ? location.longitude : null,
      altitude: location ? location.altitude : null,
      message: message,
      category: selectedItem,
      locationText: locationText,
      anonymous,
    };
    if (imageUri) {
      localUri = imageUri.uri;
      filename = localUri.split("/").pop();
      match = /\.(\w+)$/.exec(filename);
      type = match ? `image/${match[1]}` : `image`;
      photo = {
        uri: localUri,
        type,
        name: filename,
        ...mendatoryData,
      };
      form.append("complain-photo", photo);
    }
    form.append("dataa", JSON.stringify(mendatoryData));

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
          <H3 style={styles.header}>POST WARNING</H3>
          <View style={styles.division}></View>

          <View style={authStyle.formContainer}>
            <AppText style={authStyle.text}>Choose Category</AppText>
            <Picker
              items={category}
              selectedItem={selectedItem}
              onSelectItem={(item) => setSelectedItem(item)}
            />
            {(!fetching && !location) ||
              (gallery && (
                <React.Fragment>
                  <AppText>Location</AppText>
                  <Input
                    value={locationText}
                    onChangeText={(e) => setLocationText(e)}
                  />
                </React.Fragment>
              ))}
            <AppText style={authStyle.text}>Message</AppText>
            <Input
              placeholder="Enter any message here"
              numberOfLines={4}
              value={message}
              onChangeText={(e) => setMessage(e)}
            />
            <AppText style={authStyle.text}>Send complain as anonymous</AppText>
            <Button
              title={anonymous ? "Anoymous mode" : "Not anonymous mode"}
              style={{
                backgroundColor: "white",
                marginTop: 5,
                marginBottom: 5,
              }}
              buttonFontStyle={{
                color: Colors.primaryLight,
                fontWeight: "600",
              }}
              onPress={() => setAnonymous(!anonymous)}
            />
            <View>
              <AppText style={authStyle.text}>Choose From Gallery</AppText>
              <ImageInput
                imageUri={imageUri}
                onChangeImage={(uri) => setFromGallery(uri)}
              />

              <Camera
                imageUri={imageUri}
                onChangeImage={(uri) => setFromCamera(uri)}
              />
              <ErrorMessage
                visible={error}
                error={error}
                style={{ textAlign: "center", marginTop: 30 }}
              />
            </View>

            {/* <MaterialCommunityIcons
                    name="camera"
                    size={32}
                    style={{ alignSelf: 'flex-end' }}
                />
                <MaterialCommunityIcons
                    name="file"
                    size={32}
                    style={{ alignSelf: 'flex-end' }}
                /> */}
          </View>

          <View style={authStyle.registerBtn}>
            {!loading && !fetching ? (
              <Button title="Post" onPress={handleSubmit} />
            ) : (
              <ActivityIndicator color={!fetching ? Colors.primary : "white"} />
            )}
          </View>
        </ScrollView>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.purpleTransparent,
    height: "100%",
  },
  container: {
    borderRadius:20,
    marginTop: 60,
    backgroundColor: Colors.white,
    height: "100%",
  },
  header: {
    color: Colors.black,
    marginTop: 60,
    marginLeft: 30,
    fontSize: 18,
    letterSpacing: 3,
    fontWeight: "600",
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
  modal: {
    width: 300,
    height: 100,
    margin: 0,
    // display: "flex",
    // backgroundColor: Colors.purple,
    // flex: 1,
  },
  icon: {},
  logoutButton: {
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    backgroundColor: Colors.pink,
    borderRadius: 50,
    height: 50,
    fontSize: 17,
    color: Colors.white,
    width: "85%",
    position: "absolute",
    bottom: 20,
  },
});
