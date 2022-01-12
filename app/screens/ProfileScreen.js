/** @format */

import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  Text,
  Image,
  Button,
} from 'react-native';
import axios from 'axios';
import * as Yup from 'yup';
import ListItem from '../components/ListItem';
import ListItemSeperator from '../components/ListItemSeperator.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from '../components/Icon';
import AuthContext from '../Context/AuthContext';
import environment from '../config/environment/environment';
import FormField from '../components/form/FormField';
import Form from '../components/form/Form';
import SubmitButton from '../components/form/SubmitButton';
import { authStyle } from '../config/styles';
import ErrorMessage from '../components/form/ErrorMessage';
import AppText from '../components/text/AppText';
import Screen from '../components/Screen';
import H3 from '../components/text/H3';
import ActivityIndicator from '../components/ActivityIndicator';
import Colors from '../config/Colors';

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
  newPassword: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, setChange, change } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // const globalStateUpdate = useGlobalStateUpdate();
  // const [spinner, setSpinner] = useState(false);

  //   const handleSubmit = async ({ password, newPassword }) => {
  //     setLoading(true);
  //     try {
  //       await axios.post(`${environment.baseUrl}/update-password`, {
  //         newPassword,
  //         password: password,
  //       });
  //       setLoading(false);
  //       setError(false);
  //       Alert.alert("Password updated successfully", ``, [
  //         { text: "Go back", onPress: () => setModalVisible(false) },
  //       ]);
  //     } catch (err) {
  //       if (err.response) {
  //         setError(err.response.data.message);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  async function logout() {
    // navigation.navigate('MyRequests')
    try {
      await axios.post(`${environment.baseUrl}/logout`);
      setChange(!change);
    } catch (err) {
      setChange(!change);
    } finally {
    }
  }

  return (
    <View style={styles.container}>
      <H3 style={styles.header}>PROFILE</H3>

      <Text style={styles.name}>{user.name}</Text>

      <View style={styles.division}></View>

      <View style={styles.flex}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/mail2.png')}
        />
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* <View style={styles.flex}>
        <Image
          style={styles.icon}
          source={require("../assets/icons/password2.png")}
        />
        <Text style={styles.password} onPress={() => setModalVisible(true)}>
          CHANGE PASSWORD
        </Text>
      </View> */}

      <Text onPress={logout} style={styles.logoutButton}>
        Logout [➜
      </Text>

      {/* <Modal
        style={styles.modal}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Screen style={styles.modal}>
          <TouchableOpacity
            style={{
              position: "relative",
              right: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <H3 style={{ flex: 1, color: "white" }}></H3>
              <MaterialCommunityIcons
                name="close"
                size={32}
                color={Colors.semiTransparentWhite}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </TouchableOpacity>
          <Form
            initialValues={{ password: "", newPassword: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <View style={authStyle.formContainer}>
              <FormField
                placeholder="Current password"
                inputContainerStyle={[authStyle.input, { marginBottom: 5 }]}
                name="password"
                secureTextEntry
              />
              <FormField
                placeholder="New password"
                inputContainerStyle={authStyle.input}
                secureTextEntry
                name="newPassword"
              />
              <ErrorMessage visible={error} error={error} />
            </View>

            <View style={authStyle.registerBtn}>
              {!loading ? (
                <Text onPress={logout} style={styles.logoutButton} onPress={handleSubmit}>
                CHANGE PASSWORD
              </Text>
              ) : (
                <ActivityIndicator color={Colors.primary} visible={loading} />
              )}
            </View>
          </Form>
        </Screen>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purple,
    height: '100%',
  },
  header: {
    color: Colors.white,
    marginTop: 60,
    marginLeft: 30,
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: '700',
  },
  name: {
    marginLeft: 30,
    color: Colors.white,
    marginTop: 30,
    fontSize: 25,
    letterSpacing: 3,
    fontWeight: '600',
  },
  division: {
    marginTop: 20,
    backgroundColor: Colors.barelySeenWhite,
    height: 1,
    width: '100%',
  },
  flex: {
    alignItems: 'flex-start',
    flexDirection: 'row',
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
    fontWeight: '600',
  },
  modal: {
    display: 'flex',
    backgroundColor: Colors.purple,
    flex: 1,
  },
  icon: {},
  logoutButton: {
    textAlign: 'center',
    paddingTop: 12,
    alignSelf: 'center',
    backgroundColor: Colors.pink,
    borderRadius: 50,
    height: 50,
    fontSize: 17,
    color: Colors.white,
    width: '85%',
    position: 'absolute',
    bottom: 20,
  },
});
