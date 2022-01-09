import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '../../screens/HomeScreen';
import MapScreen from '../../screens/MapScreen';


const Stack = createStackNavigator();



const FeedNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home'
                component={HomeScreen}
                options={{
                    headerShown: false
                }}

            />
            <Stack.Screen name='Map'
                component={MapScreen}
            />

        </Stack.Navigator>
    )

}
export default FeedNavigator;