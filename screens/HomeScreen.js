import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import { Icon } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";
import { db, auth } from "../firebase/firebase";

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        { timeInterval: 5000, distanceInterval: 2 },
        (loc) => setLocation(JSON.parse(JSON.stringify(loc)))
      );
    };
    getPermission();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View></View>
        {/* Followed Icon */}
        {/* Search Icon */}
        {/* Chat Icon */}
      </View>
      {/* CENTER */}
      <View style={styles.center__container}>
        <Text style={tw`text-white`}>{location?.coords?.longitude}</Text>
        <Text style={tw`text-white`}>{location?.coords?.latitude}</Text>
      </View>

      {/* BOTTOM NAV */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
