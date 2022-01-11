import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
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
import AuthContext from "../Context/AuthContext";
import Colors from "../config/Colors";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Required").email().label("Email"),
  password: Yup.string().required("Required").label("Password"),
});

export default function LoginScreen({ navigation }) {
  const { setChange, change } = useContext(AuthContext);
  const navigateToRegister = () => navigation.navigate("RegisterScreen");

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ email, password, googleLogin, name }) => {
    setLoading(true);
    try {
      await axios.post(`${environment.baseUrl}/auth/login`, {
        email: email.toLowerCase(),
        password: password,
        googleLogin,
        name,
      });
      setChange(!change);
      setError(false);
    } catch (err) {
      if (err.response) {
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
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <View style={authStyle.formContainer}>
          <FormField
            placeholder="Your email"
            inputContainerStyle={authStyle.input}
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
            <SubmitButton title="SIGN IN" />
          ) : (
            <ActivityIndicator color={Colors.primary} />
          )}

          <View style={authStyle.flexElementsShort}>
            <View style={authStyle.divider}></View>
            <AppText style={authStyle.or}>OR</AppText>
            <View style={authStyle.divider}></View>
          </View>

          <View style={authStyle.flexElements}>
            <AppText style={authStyle.btnLabel}>FIRST TIME HERE? </AppText>
            <TouchableWithoutFeedback onPress={navigateToRegister}>
              <AppText style={authStyle.btnLabel}>CREATE ACCOUNT </AppText>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Form>
    </ImageBackground>
  );
}
