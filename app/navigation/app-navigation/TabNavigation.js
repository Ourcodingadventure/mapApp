import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedNavigator from "../FeedNavigator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ComplainButton from "../../components/ComplainButton";
import ProfileNavigation from "../profile-navigation/ProfileNavigation";
import PostNavigation from "../post-navigation.js/PostNavigation";
import WeatherScreen from "../../screens/WeatherScreen";

import MyMap from "../../screens/MyMap";

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingBottom: 6,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Map"
        component={MyMap}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="PostComplainTab"
        component={PostNavigation}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <ComplainButton
              onPress={() => navigation.navigate("PostComplainTab")}
            />
          ),
          tabBarLabel: "Post Complain",
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weather-sunny"
              color={color}
              size={size}
            />
          ),
          tabBarLabel: "Weather",
          title: "My Profile",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          tabBarLabel: "Profile",
          title: "My Profile",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigation;
