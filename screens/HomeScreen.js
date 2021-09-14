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
      db.collection("userLocation")
        .doc(auth.currentUser.uid)
        .get()
        .then((userADoc) => {
          if (userADoc.exists) {
            let userA = {
              latitude: userADoc.data().coords.latitude,
              longitude: userADoc.data().coords.longitude,
            };
            db.collection("userLocation")
              .get()
              .then((snapshot) => {
                snapshot.docs.map((userBDoc) => {
                  /////IF BOTH USERS ALREADY NOTIFICATED IN THE PAST, THEN GO TO NEXT DOC//////
                  if (userBDoc.id !== auth.currentUser.uid) {
                    let isExist = false;
                    db.collection("notificationIds")
                      .get()
                      .then((snapshot) => {
                        snapshot.docs.map((notificationId) => {
                          if (
                            notificationId
                              .data()
                              .participants.includes(auth.currentUser.uid) &&
                            notificationId
                              .data()
                              .participants.includes(userBDoc.id)
                          ) {
                            isExist = true;
                          }
                        });
                        if (!isExist) {
                          let userB = {
                            latitude: userBDoc.data().coords.latitude,
                            longitude: userBDoc.data().coords.longitude,
                          };
                          const distance = haversine(userA, userB);
                          
                          setDistanceFromUsers([]);
                          setDistanceFromUsers((oldArray) => [
                            ...oldArray,
                            {
                              distanceBetweenUsers: distance,
                              otherUser: userBDoc.data().displayName,
                              currentUser: userADoc.data().displayName,
                            },
                          ]);
                          if (distance <= 150) {
                            db.collection("userGames")
                              .doc(auth.currentUser.uid)
                              .get()
                              .then((userAGames) => {
                                db.collection("userGames")
                                  .doc(userBDoc.id)
                                  .get()
                                  .then((userBGames) => {
                                    const similarGames = userAGames
                                      .data()
                                      .games.filter((game) =>
                                        userBGames.data().games.includes(game)
                                      );
                                    if (similarGames.length > 0) {
                                      db.collection("notificationIds").add({
                                        participants: [
                                          auth.currentUser.uid,
                                          userBDoc.id,
                                        ],
                                      });
                                      sendPushNotification(
                                        expoPushToken?.token
                                      );
                                    }
                                  });
                              });
                          }
                        }
                      });
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
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
    </SafeAreaView>
  );
};

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Gamer Found!",
    body: "A gamer plays the same game as you.",
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
