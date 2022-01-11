import React, { useState, useContext } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import AppText from "../components/text/AppText";
import { authStyle } from "../config/styles";
import FormField from "../components/form/FormField";
import Form from "../components/form/Form";
import SubmitButton from "../components/form/SubmitButton";
import * as Yup from "yup";
import axios from "axios";
import environment from "../config/environment/environment";
import ErrorMessage from "../components/form/ErrorMessage";
import Colors from "../config/Colors";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Required").label("username"),
  email: Yup.string().required("Required").email().label("Email"),
  password: Yup.string().required("Required").min(6).label("Password"),
});

export default function LoginScreen({ navigation }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigateToLogin = () => navigation.navigate("LoginScreen");

  const handleSubmit = async ({ username, email, password }) => {
    setLoading(true);
    try {
      let res = await axios.post(`${environment.baseUrl}/auth/signup`, {
        email: email.toLowerCase(),
        password,
        name: username,
      });

      setError(false);
      Alert.alert("Signedup Successfully", `Welcome ${username}`, [
        {
          text: "Go Back To Login",
          onPress: () => navigation.navigate("LoginScreen"),
        },
      ]);
    } catch (err) {
      console.log("err", err.response);
      if (err.response.data.message) {
        setError(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={authStyle.image}
      source={require("../assets/splash.png")}
    >
      <Form
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <View style={authStyle.formContainer}>
          <FormField
            placeholder="Your username"
            inputContainerStyle={authStyle.input}
            name="username"
          />
          <FormField
            placeholder="Your email"
            inputContainerStyle={[authStyle.input, { marginBottom: 5 }]}
            name="email"
          />
          <FormField
            placeholder="Your password"
            inputContainerStyle={authStyle.input}
            secureTextEntry
            name="password"
          />
          <ErrorMessage visible={error} error={error} />
        </View>

        <View style={authStyle.registerBtn}>
          {!loading ? (
            <SubmitButton title="SIGN UP" />
          ) : (
            <ActivityIndicator color={Colors.primary} />
          )}

          <View style={authStyle.flexElementsShort}>
            <View style={authStyle.divider}></View>
            <AppText style={authStyle.or}>OR</AppText>
            <View style={authStyle.divider}></View>
          </View>

          <View style={authStyle.flexElements}>
            <AppText style={authStyle.btnLabel}>HAVE AN ACCOUNT? </AppText>
            <TouchableWithoutFeedback onPress={navigateToLogin}>
              <AppText style={authStyle.btnLabel}>PROCEED TO LOGIN</AppText>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Form>
    </ImageBackground>
  );
}
