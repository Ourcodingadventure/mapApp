import React, { useState, useContext, useEffect } from "react";
import { View, TouchableWithoutFeedback, ActivityIndicator, ImageBackground } from "react-native";
import AppText from "../components/text/AppText";
// import H3 from "../components/text/H2";
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
import Screen from "../components/Screen";

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
    <Screen style={authStyle.container}>
      <ImageBackground
        resizeMode="cover"
        style={authStyle.image}
        source={require("../assets/splash.png")}
      >
        {/* <View style={authStyle.headerContainer}>
          <H3 style={authStyle.headerText}>Login</H3>
        </View> */}
        <Form
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View style={authStyle.formContainer}>
            <AppText style={authStyle.text}>Email</AppText>
            <FormField
              placeholder="Enter email"
              inputContainerStyle={[authStyle.input, { marginBottom: 5 }]}
              name="email"
            />
            <AppText style={authStyle.text}>Password</AppText>
            <FormField
              placeholder="Enter password"
              inputContainerStyle={authStyle.input}
              secureTextEntry
              name="password"
            />
            <ErrorMessage visible={error} error={error} />
          </View>

          <View style={authStyle.registerBtn}>
            <AppText style={authStyle.btnLabel}>
              Don't have an account?{" "}
              <TouchableWithoutFeedback onPress={navigateToRegister}>
                <AppText style={authStyle.btnLabelText}>Register </AppText>
              </TouchableWithoutFeedback>
            </AppText>
            {!loading ? (
              <SubmitButton title="Login" />
            ) : (
              <ActivityIndicator color={Colors.primary} />
            )}
          </View>
        </Form>
      </ImageBackground>
    </Screen>
  );
}
