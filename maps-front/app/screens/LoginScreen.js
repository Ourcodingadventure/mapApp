import React, { useState, useContext, useEffect } from 'react'
import {
    View, TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native'
import AppText from '../components/text/AppText';
import H3 from '../components/text/H2';
import { authStyle } from '../config/styles';
import FormField from '../components/form/FormField';
import Form from '../components/form/Form';
import SubmitButton from '../components/form/SubmitButton';
import * as Yup from "yup";
import axios from 'axios';
import environment from '../config/environment/environment'
import ErrorMessage from '../components/form/ErrorMessage';
import AuthContext from '../Context/AuthContext';
import Colors from '../config/Colors';
import GoogleButton from '../components/GoolgeButton';
import useGoogleLogin from '../hooks/useGoogleLogin';
import Screen from '../components/Screen';

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Required').email().label("Email"),
    password: Yup.string().required('Required').label("Password"),
});


export default function LoginScreen({ navigation }) {
    const { setChange, change } = useContext(AuthContext);
    const navigateToRegister = () => navigation.navigate('RegisterScreen')
    const navigateToForget = () => navigation.navigate('ForgotPassword')
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false)
    const { setGoogleUser, googleUser, googleError, signInAsync, res, setResponse } = useGoogleLogin();
    let ref = React.useRef();

    const handleSubmit = async ({ email, password, googleLogin, name }) => {
        setLoading(true)
        try {
            await axios.post(`${environment.baseUrl}/auth/login`, {
                email: email.toLowerCase(),
                password: password,
                googleLogin,
                name,
            });
            setChange(!change)
            setError(false)
            if (googleLogin) {
                setResponse(false)
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message)
            }

        } finally {
            setLoading(false);
            if (googleLogin) {
                setGoogleUser(false)
            }
        }
    }
    useEffect(() => {
        if (googleUser) {
            console.log('handle submit: ', handleSubmit)
            handleSubmit({
                email: googleUser.email,
                name: googleUser.name,
                password: 'blank',
                googleLogin: true,
            })
        }
        setLoading(false);

    }, [res, googleUser])
    const googleLogin = async () => {
        setLoading(true);
        await signInAsync();
    }

const setRef = (input)=>{
    ref = input
}


    return (
        <Screen style={authStyle.container}>
            <View style={authStyle.headerContainer}>
                <H3 style={authStyle.headerText}>Login</H3>
            </View>
            <Form
                initialValues={{ email: "", password: "" }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                <View style={authStyle.formContainer}>

                    <AppText style={authStyle.text}>Email</AppText>
                    <FormField
                        placeholder='Enter email'
                        inputContainerStyle={[authStyle.input, { marginBottom: 5 }]}
                        name='email'
                        onSubmitEditing={()=>{
                         ref.focus()
                        }}
                    />
                    <AppText style={authStyle.text}>Password</AppText>
                    <FormField
                        placeholder='Enter password'
                        inputContainerStyle={authStyle.input}
                        secureTextEntry
                        name='password'
                        setRef={setRef}
                
                    />
                    <ErrorMessage visible={error} error={error} />
                    <TouchableWithoutFeedback onPress={navigateToForget}>
                        <AppText
                            style={{ alignSelf: 'flex-end' }}
                        >Forgot password?
                        </AppText>
                    </TouchableWithoutFeedback>

                    <View style={{ padding: 30 }}>
                        <AppText style={[authStyle.text, { alignSelf: 'center', marginBottom: 10 }]}> Or login with </AppText>
                        <GoogleButton onPress={googleLogin} />
                    </View>
                </View>

                <View style={authStyle.registerBtn}>
                    <AppText style={authStyle.btnLabel}>Don't have an account? <TouchableWithoutFeedback onPress={navigateToRegister}><AppText
                        style={authStyle.btnLabelText} >Register  </AppText>
                    </TouchableWithoutFeedback>
                    </AppText>
                    {!loading ? <SubmitButton title='Login' /> : <ActivityIndicator color={Colors.primary} />}
                </View>
            </Form>

        </Screen>
    )
}

