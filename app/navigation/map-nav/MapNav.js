import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/HomeScreen";
import MapScreen from "../../screens/MapScreen";
import MyMap from "../../screens/MyMap";
import Header from "../../screens/Header";

const Stack = createStackNavigator();

const MapNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Header"
        component={Header}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="MyMap" component={MyMap} />
    </Stack.Navigator>
  );
};
export default MapNav;
