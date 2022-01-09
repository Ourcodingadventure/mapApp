import React, { useState, useContext } from 'react'
import {
    View,
    ActivityIndicator,
    Alert,
} from 'react-native'
import Screen from '../components/Screen';
import Input from '../components/Input';
import AppText from '../components/text/AppText';
import Button from '../components/Button'
import H3 from '../components/text/H2';
import { authStyle } from '../config/styles';
import FormField from '../components/form/FormField';
import Form from '../components/form/Form';
import SubmitButton from '../components/form/SubmitButton';
import * as Yup from "yup";
import ErrorMessage from '../components/form/ErrorMessage';
import Colors from '../config/Colors';
import env from '../config/environment/environment'
import axios from 'axios';
import AuthContext from '../Context/AuthContext';
const validationSchema = Yup.object().shape({
    otp: Yup.string().required('Required').label("otp"),
    newPassword: Yup.string().required('Required').min(6).label("Password"),
});


export default function OtpScreen({ navigation }) {
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const { forgetEmail, setForgetEmail } = useContext(AuthContext);
    const handleSubmit = async ({ otp, newPassword }) => {
        setLoading(true);

        try {
            let res = await axios.post(`${env.baseUrl}/auth/forget-password-step-2`, {
                newPassword,
                otp,
                email: forgetEmail,
            })
            Alert.alert('Password Changed', ``, [
                { text: 'Go Back To Login', onPress: () => navigation.navigate('LoginScreen') },
            ])
        } catch (err) {
            console.log('err:', err.response)
            setError(err.response.data.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Screen style={authStyle.container}>
            <Form
                initialValues={{ otp: '', newPassword: '' }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                <View style={authStyle.formContainer}>
                    <AppText style={authStyle.text}>Otp</AppText>
                    <FormField
                        placeholder='Enter OTP'
                        inputContainerStyle={[authStyle.input, { marginBottom: 5 }]}
                        name='otp'
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
                    {!loading ? <SubmitButton title='Submit' /> : <ActivityIndicator color={Colors.primary} />}
                </View>
            </Form>
        </Screen>
    )
}

