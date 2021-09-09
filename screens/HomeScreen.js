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
import haversine from "haversine-distance";

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [distanceFromUsers, setDistanceFromUsers] = useState([]);
  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        { timeInterval: 5000, distanceInterval: 1 },
        (loc) => setLocation(JSON.parse(JSON.stringify(loc)))
      );
      if (location) {
        db.collection("userLocation")
          .doc(auth.currentUser.uid)
          .set({ ...location, displayName: auth.currentUser.displayName })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
    };
    getPermission();
  }, [location?.coords?.altitude]);
  
  useEffect(() => {
    // INTERVAL run every 5secs

    const interval = setInterval(() => {
      setDistanceFromUsers([]);
      db.collection("userLocation")
        .doc(auth.currentUser.uid)
        .get()
        .then((userDoc) => {
          if (userDoc.exists) {
            let userA = {
              latitude: userDoc.data().coords.latitude,
              longitude: userDoc.data().coords.longitude,
            };
            db.collection("userLocation")
              .get()
              .then((snapshot) => {
                snapshot.docs.map((doc) => {
                  if (doc.id !== auth.currentUser.uid) {
                    let userB = {
                      latitude: doc.data().coords.latitude,
                      longitude: doc.data().coords.longitude,
                    };
                    const distance = haversine(userA, userB);
                    setDistanceFromUsers((oldArray) => [
                      ...oldArray,
                      {
                        distanceBetweenUsers: distance,
                        displayName: doc.data().displayName,
                      },
                    ]);
                  }
                });
              });
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  console.log("what", distanceFromUsers);
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
        {distanceFromUsers.map(
          ({ displayName, distanceBetweenUsers }, index) => (
            <Text style={tw`text-white`} key={index}>
              User: {displayName} -> {distanceBetweenUsers} meters
            </Text>
          )
        )}
      </View>

      {/* BOTTOM NAV */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
