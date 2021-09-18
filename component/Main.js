import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase/firebase";
import React from "react";
import SearchScreen from "./../screens/SearchScreen";
const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName={HomeScreen}
      screenOptions={{
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
        tabBarActiveBackgroundColor: "white",
        tabBarActiveTintColor: "black",
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ color }) => (
            <Icon
              name="search-outline"
              type="ionicon"
              color={color}
              size={35}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" type="ionicon" color={color} size={35} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;
