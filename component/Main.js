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
import {db, auth} from '../firebase/firebase'

const Tab = createBottomTabNavigator();

const Main = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  return (
      <Tab.Navigator
        initialRouteName={HomeScreen}
        sceneContainerStyle={{ backgroundColor: "#0d0a36" }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#0d0a36",
            borderTopWidth: 0.5,
            borderTopColor: "lightgreen",
          },
          tabBarActiveBackgroundColor: "lightgreen",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarButton: (props) => <TouchableOpacity {...props} />,
            tabBarIcon: () => (
              <Icon
                name="home-outline"
                type="ionicon"
                color={"white"}
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
            tabBarIcon: () => (
              <Icon
                name="person-circle-outline"
                type="ionicon"
                color={"white"}
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
