import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PostComplainScreen from "../../screens/PostComplainScreen";
import MyMap from "../../screens/Mymap";
import MapScreen from "../../screens/MapScreen";
const Stack = createStackNavigator();

const MapNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={MyMap}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default MapNavigation;
