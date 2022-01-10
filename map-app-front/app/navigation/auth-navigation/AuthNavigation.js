import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from '../../screens/RegisterScreen';
import LoginScreen from '../../screens/LoginScreen';




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

        </Stack.Navigator>
    )

}
export default AuthNavigation;