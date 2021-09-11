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
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login } from "../slices/userSlice";
import { selectNotification } from "../slices/notificationSlice";
import { useNavigation } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import { Icon, Button } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";
import { db, auth } from "../firebase/firebase";
import haversine from "haversine-distance";

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [distanceFromUsers, setDistanceFromUsers] = useState([]);
  const expoPushToken = useSelector(selectNotification);
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

    db.collection("userInfo")
      .doc(auth.currentUser.uid)
      .get()
      .then((docInfo) => {
        dispatch(login(docInfo.data()));
      })
      .catch((error) => console.log(error));
  }, [location?.coords?.altitude]);

  useEffect(() => {
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
                        otherUser: doc.data().displayName,
                        currentUser: userDoc.data().displayName,
                      },
                    ]);

                    // if (distance <= 150) {
                    //   let other_user_username;
                    //   let isExist = false;
                    //   db.collection("notificationId")
                    //     .get()
                    //     .then((snapshot) => {
                    //       snapshot.docs.map((notifDoc) => {
                    //         if (
                    //           notifDoc.id === auth.currentUser.uid &&
                    //           notifDoc.data().otherUser === doc.id
                    //         ) {
                    //           isExist = true;
                    //           return;
                    //         }
                    //       });
                    //     });
                    //   if (!isExist) {
                    //     if (similarGames) {
                    //       db.collection("notificationId")
                    //         .doc(auth.currentUser.uid)
                    //         .set({
                    //           otherUser: doc.id,
                    //         });
                    //       db.collection("userInfo")
                    //         .doc(doc.id)
                    //         .get()
                    //         .then((userDoc) => {
                    //           other_user_username = userDoc.data().username;
                    //         });
                    //       sendPushNotification(
                    //         expoPushToken?.token,
                    //         other_user_username
                    //       );
                    //     }
                    //   }
                    // }
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
  console.log(distanceFromUsers);
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
          ({ otherUser, distanceBetweenUsers, currentUser }, index) => (
            <Text style={tw`text-white`} key={index}>
              User: {otherUser} -> {distanceBetweenUsers} meters {currentUser}
            </Text>
          )
        )}
      </View>
      <Text style={tw`text-white`}>{expoPushToken?.token}</Text>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken?.token, "hay");
        }}
      />
      {/* BOTTOM NAV */}
    </SafeAreaView>
  );
};

async function sendPushNotification(expoPushToken, other_user_username) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Gamer Found!",
    body: `${other_user_username} plays the same game as you.`,
    data: { data: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default HomeScreen;

const styles = StyleSheet.create({});
