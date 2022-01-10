import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Modal,
    TouchableOpacity,
    Alert
} from 'react-native'
import axios from 'axios';
import * as Yup from 'yup';
import ListItem from '../components/ListItem';
import ListItemSeperator from '../components/ListItemSeperator.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from '../components/Icon'
import AuthContext from '../Context/AuthContext';
import environment from '../config/environment/environment';
import FormField from '../components/form/FormField'
import Form from '../components/form/Form'
import SubmitButton from '../components/form/SubmitButton'
import { authStyle } from '../config/styles';
import ErrorMessage from '../components/form/ErrorMessage';
import AppText from '../components/text/AppText';
import Screen from '../components/Screen';
import H3 from '../components/text/H3'
import ActivityIndicator from '../components/ActivityIndicator';
import Colors from '../config/Colors';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .required('Required'),
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


    const userInfo = [
        {
            title: user.name,
            icon: {
                name: "account",
                backgroundColor: 'tomato',
            },
        },
        {
            title: user.email,
            icon: {
                name: "email",
                backgroundColor: '#00868B',
            },

        },
    ];



    const handleSubmit = async ({ password, newPassword }) => {
        setLoading(true)
        try {
            await axios.post(`${environment.baseUrl}/update-password`, {
                newPassword,
                password: password,
            });
            setLoading(false);
            setError(false)
            Alert.alert('Password updated successfully', ``, [
                { text: 'Go back', onPress: () => setModalVisible(false) },
            ])
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message)
            }

        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        // navigation.navigate('MyRequests')
        try {
            await axios.post(`${environment.baseUrl}/logout`)
            setChange(!change)
        } catch (err) {
            setChange(!change)
        } finally {
        }
    }



    return (

        <View style={styles.container} >
            <FlatList
                style={{ marginBottom: 20 }}
                data={userInfo}
                keyExtractor={(userInfo) => userInfo.title}
                ItemSeparatorComponent={ListItemSeperator}
                renderItem={({ item }) => (
                    <ListItem
                        title={item.title}
                        IconComponent={
                            <Icon
                                name={item.icon.name}
                                backgroundColor={item.icon.backgroundColor}
                            />
                        }
                    />
                )}
            />
            <ListItem
                title="Change Password"
                IconComponent={<Icon name="lock" backgroundColor="purple" />}
                onPress={() => setModalVisible(true)}
            />
            <ListItem
                title="Logout"
                IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
                onPress={logout}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}

                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Screen style={styles.modal}>
                    <TouchableOpacity
                        style={{
                            position: 'relative',
                            right: 10
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <H3
                                style={{ flex: 1, color: 'white' }}
                            >
                                Change Password
                            </H3>
                            <MaterialCommunityIcons name='close' size={32} color='black'
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

                            <AppText style={authStyle.text}>Current Password</AppText>
                            <FormField
                                placeholder='Enter current password'
                                inputContainerStyle={[authStyle.input, { marginBottom: 5 }]}
                                name='password'
                                secureTextEntry
                            />
                            <AppText style={authStyle.text}>New Password</AppText>
                            <FormField
                                placeholder='Enter new password'
                                inputContainerStyle={authStyle.input}
                                secureTextEntry
                                name='newPassword'
                            />
                            <ErrorMessage visible={error} error={error} />
                        </View>

                        <View style={authStyle.registerBtn}>

                            {!loading ? <SubmitButton title='Change Password' /> : <ActivityIndicator color={Colors.primary} visible={loading} />}
                        </View>
                    </Form>

                </Screen>
            </Modal>


        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    },
    screen: {
        backgroundColor: 'gray',
    },

    modal: {
        display: 'flex',
        backgroundColor: 'white',
        flex: 1,
        padding: 8,
    },


});