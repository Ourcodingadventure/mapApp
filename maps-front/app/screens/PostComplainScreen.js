import React, { useState, useEffect, useCallback } from "react";
import { View, ActivityIndicator, ScrollView, FlatList } from "react-native";
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
  const [organization, setOrganization] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [imageUri, onChangeImage] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [category, setCategory] = useState([
    { name: "Potholes Issue", id: 1 },
    { name: "Pavement Issue", id: 2 },
    { name: "Sewage Issue", id: 3 },
    { name: "Garbage Issue", id: 4 },
    { name: "Street Light Outage Issue", id: 5 },
    { name: "Illegal Parking Issue", id: 6 },
    { name: "Violent Animals Issue", id: 7 },
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
    if (!selectedItem) return setError("please choose problem category");
    if (!selectedOrganization) return setError("please choose organization");
    if (!location && !locationText) return setError("Enter location please");

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
      organization: selectedOrganization,
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
        alert("Your complain has been placed successfully");
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
    <Screen style={authStyle.container}>
      <ScrollView>
        <View style={authStyle.headerContainer}>
          <H3 style={authStyle.headerText}>Post Complain</H3>
        </View>

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
            style={{ backgroundColor: "white", marginTop: 5, marginBottom: 5 }}
            buttonFontStyle={{ color: Colors.primaryLight, fontWeight: "600" }}
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
  );
}
