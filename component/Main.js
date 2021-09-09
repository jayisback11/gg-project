import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase/firebase";

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName={HomeScreen}
      sceneContainerStyle={{ backgroundColor: "black" }}
      screenOptions={{
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0.5,
          borderTopColor: "white",
        },
        tabBarActiveBackgroundColor: "white",
        tabBarActiveTintColor: 'black',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ color }) => (
            <Icon
              name="home-outline"
              type="ionicon"
              color={color}
              size={35}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({color}) => (
            <Icon
              name="person-circle-outline"
              type="ionicon"
              color={color}
              size={35}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;

const styles = StyleSheet.create({});
