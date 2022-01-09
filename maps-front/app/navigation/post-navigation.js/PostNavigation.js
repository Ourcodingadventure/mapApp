import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import PostComplainScreen from '../../screens/PostComplainScreen'
const Stack = createStackNavigator();



const PostNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='PostComplain' component={PostComplainScreen}
                options={{
                    headerShown: false
                }
                }
            />

        </Stack.Navigator>
    )

}
export default PostNavigation;