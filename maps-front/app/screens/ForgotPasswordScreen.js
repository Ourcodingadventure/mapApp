import React, { useState, useContext } from 'react'
import {
    View, ActivityIndicator
} from 'react-native'
import Screen from '../components/Screen';
import AppText from '../components/text/AppText';
import { authStyle } from '../config/styles';
import FormField from '../components/form/FormField';
import Form from '../components/form/Form';
import SubmitButton from '../components/form/SubmitButton';
import * as Yup from "yup";
import axios from 'axios';
import env from '../config/environment/environment';
import ErrorMessage from '../components/form/ErrorMessage';
import Colors from '../config/Colors';
import AuthContext from '../Context/AuthContext';
const validationSchema = Yup.object().shape({
    email: Yup.string().required('Required').email().label("Email"),
});


export default function ForgotPasswordScreen({ navigation }) {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false)
    const { setForgetEmail } = useContext(AuthContext);

    const handleSubmit = async ({ email }) => {
        setLoading(true);
        try {
            await axios.post(`${env.baseUrl}/auth/forget-password`, {
                email: email.toLowerCase(),
            });
            navigation.navigate('ChangePassword')
            setError(false)
            setForgetEmail(email)
        } catch (err) {
            setError(err.response.data.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Screen style={authStyle.container}>
            <Form
                initialValues={{ email: "" }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                <View style={authStyle.formContainer}>

                    <AppText style={authStyle.text}>Email</AppText>
                    <FormField
                        placeholder='Enter email'
                        inputContainerStyle={[authStyle.input, { marginBottom: 5 }]}
                        name='email'
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

