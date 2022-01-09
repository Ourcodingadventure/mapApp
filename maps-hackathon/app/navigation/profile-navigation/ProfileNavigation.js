import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../../screens/ProfileScreen";
import MyComplainsScreen from "../../screens/MyComplainsScreen";

const Stack = createStackNavigator();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={ProfileScreen}
        options={{
          title: "My Profile",
        }}
      />
      <Stack.Screen
        name="MyComplaints"
        component={MyComplainsScreen}
        options={{
          title: "My Complains",
        }}
      />
    </Stack.Navigator>
  );
};
export default ProfileNavigation;
