import React, { useState, useContext } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import AppText from "../components/text/AppText";
import H3 from "../components/text/H2";
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
    <View style={authStyle.container}>
      <View style={authStyle.headerContainer}>
        <H3 style={authStyle.headerText}>Register</H3>
      </View>
      <Form
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <View style={authStyle.formContainer}>
          <AppText style={authStyle.text}>Username</AppText>
          <FormField
            placeholder="Enter username"
            inputContainerStyle={authStyle.input}
            name="username"
          />
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
            Already Have an account?{" "}
            <TouchableWithoutFeedback onPress={navigateToLogin}>
              <AppText style={authStyle.btnLabelText}>Login</AppText>
            </TouchableWithoutFeedback>
          </AppText>
          {!loading ? (
            <SubmitButton title="Register" />
          ) : (
            <ActivityIndicator color={Colors.primary} />
          )}
        </View>
      </Form>
    </View>
  );
}
