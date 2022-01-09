import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from '../../screens/RegisterScreen';
import LoginScreen from '../../screens/LoginScreen';
import ForgotPassword from '../../screens/ForgotPasswordScreen';
import OtpScreen from '../../screens/OtpScreen';



const Stack = createStackNavigator();



const AuthNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='LoginScreen' component={LoginScreen}
                options={{
                    headerShown: false,
                    title: 'Login'
                }}
            />
            <Stack.Screen name='RegisterScreen' component={RegisterScreen}
                options={{
                    headerShown: false,
                    title: 'Register'
                }}
            />
            <Stack.Screen name='ForgotPassword' component={ForgotPassword}
                options={{
                    title: 'Forgot Password'
                }}
            />
            <Stack.Screen name='ChangePassword' component={OtpScreen}
                options={{
                    title: 'Change Password'
                }}
            />
        </Stack.Navigator>
    )

}
export default AuthNavigation;