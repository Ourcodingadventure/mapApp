import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from '../../screens/ProfileScreen';


const Stack = createStackNavigator();



const ProfileNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='MyProfile' component={ProfileScreen}
                options={{
                    headerShown: false,
                }}
            />


        </Stack.Navigator>
    )

}
export default ProfileNavigation;