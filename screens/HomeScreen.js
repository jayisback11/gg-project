import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login } from "../slices/userSlice";
import { selectNotification } from "../slices/notificationSlice";
import { useNavigation } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import { Icon, Button, Avatar } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";
import { db, auth } from "../firebase/firebase";
import haversine from "haversine-distance";
import PermissionsButton from "../component/PermissionsButton";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [distanceFromUsers, setDistanceFromUsers] = useState([]);
  const expoPushToken = useSelector(selectNotification);
  const [games, setGames] = useState(["dota", "csgo"]);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

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
    // getPermission();

    db.collection("userInfo")
      .doc(auth.currentUser.uid)
      .get()
      .then((docInfo) => {
        dispatch(login(docInfo.data()));
      })
      .catch((error) => console.log(error));
  }, [location?.coords?.altitude]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     db.collection("userLocation")
  //       .doc(auth.currentUser.uid)
  //       .get()
  //       .then((userADoc) => {
  //         if (userADoc.exists) {
  //           let userA = {
  //             latitude: userADoc.data().coords.latitude,
  //             longitude: userADoc.data().coords.longitude,
  //           };
  // db.collection("userLocation")
  // .get()
  //             .then((snapshot) => {
  //               snapshot.docs.map((userBDoc) => {
  //                 /////IF BOTH USERS ALREADY NOTIFICATED IN THE PAST, THEN GO TO NEXT DOC//////
  //                 if (userBDoc.id !== auth.currentUser.uid) {
  //                   let isExist = false;
  //                   db.collection("notificationIds")
  //                     .get()
  //                     .then((snapshot) => {
  //                       snapshot.docs.map((notificationId) => {
  //                         if (
  //                           notificationId
  //                             .data()
  //                             .participants.includes(auth.currentUser.uid) &&
  //                           notificationId
  //                             .data()
  //                             .participants.includes(userBDoc.id)
  //                         ) {
  //                           isExist = true;
  //                         }
  //                       });
  //                       if (!isExist) {
  //                         let userB = {
  //                           latitude: userBDoc.data().coords.latitude,
  //                           longitude: userBDoc.data().coords.longitude,
  //                         };
  //                         const distance = haversine(userA, userB);

  //                         setDistanceFromUsers([]);
  //                         setDistanceFromUsers((oldArray) => [
  //                           ...oldArray,
  //                           {
  //                             distanceBetweenUsers: distance,
  //                             otherUser: userBDoc.data().displayName,
  //                             currentUser: userADoc.data().displayName,
  //                           },
  //                         ]);
  //                         if (distance <= 150) {
  //                           db.collection("userGames")
  // .doc(auth.currentUser.uid)
  //                             .get()
  //                             .then((userAGames) => {
  //                               db.collection("userGames")
  //                                 .doc(userBDoc.id)
  //                                 .get()
  //                                 .then((userBGames) => {
  //                                   const similarGames = userAGames
  //                                     .data()
  //                                     .games.filter((game) =>
  //                                       userBGames.data().games.includes(game)
  //                                     );
  //                                   if (similarGames.length > 0) {
  //                                     db.collection("notificationIds").add({
  //                                       participants: [
  //                                         auth.currentUser.uid,
  //                                         userBDoc.id,
  //                                       ],
  //                                     });
  //                                     sendPushNotification(
  //                                       expoPushToken?.token
  //                                     );
  //                                   }
  //                                 });
  //                             });
  //                         }
  //                       }
  //                     });
  //                 }
  //               });
  //             });
  //         } else {
  //           // doc.data() will be undefined in this case
  //           console.log("No such document!");
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Error getting document:", error);
  //       });
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleSignOut = () => {
    auth.signOut();
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <View style={tw`flex-row absolute top-2 right-3 items-center`}>
          <Text style={tw`text-white font-semibold text-lg mr-1`}>5</Text>
          <Icon
            style={{ top: -1 }}
            name="star"
            type="ionicon"
            size={20}
            color="yellow"
          />
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <Image
            source={require("../assets/images/profilePicture.jpg")}
            style={styles.profilePicture}
          />
        </TouchableOpacity>
        <Text style={tw`text-white text-2xl font-bold mt-2`}>jayisback11</Text>
      </View>
      <View style={styles.topBackgroundColor} />
      <View style={styles.bottomBackgroundColor}>
        <View style={styles.bottomContainer}>
          <ScrollView style={{ padding: 10 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddGames", {
                  currentGames: user?.games,
                })
              }
              style={[tw`absolute top-0 right-0`, { zIndex: 1 }]}
            >
              <Icon
                name="add-circle-outline"
                type="ionicon"
                size={35}
                color="white"
              />
            </TouchableOpacity>
            <View style={tw`items-center`}>
              <View style={tw`mb-2`}>
                {user.games ? (
                  <View style={{ height: 140 }}>
                    <Text
                      style={tw`text-white font-semibold text-xl text-center mb-2`}
                    >
                      Games
                    </Text>
                    <ScrollView horizontal={true}>
                      {user?.games.map((game) => (
                        <Image
                          key={game.name}
                          source={{
                            uri: game.backgroundImage,
                          }}
                          resizeMode="cover"
                          style={{
                            width: 50,
                            height: 100,
                            marginLeft: 5,
                            marginRight: 5,
                            borderRadius: 10,
                          }}
                        />
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <Text style={tw`text-white font-semibold text-lg`}>
                    No Games
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
          <LinearGradient
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: 25,
            }}
            colors={["rgba(0, 0, 0, 0)", "rgba(66, 15, 141, 0.8)"]}
            pointerEvents={"none"}
          />
        </View>
      </View>
    </View>
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

const styles = StyleSheet.create({
  topContainer: {
    position: "absolute",
    top: "10%",
    height: "30%",
    left: "10%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    backgroundColor: "rgba(15, 15, 15, 0.8)",
    borderRadius: 20,
  },
  topBackgroundColor: {
    flex: 0.3,
    backgroundColor: "#DC3522",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    zIndex: 1,
    elevation: 15,
  },
  bottomContainer: {
    width: "90%",
    height: "75%",
    top: "6%",
    backgroundColor: "rgba(15, 15, 15, 0.8)",
    borderRadius: 20,
    overflow: "hidden",
  },
  bottomBackgroundColor: {
    flex: 0.7,
    backgroundColor: "#420F8D",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    width: 125,
    height: 125,
    borderRadius: 62.5,
    borderWidth: 2,
    borderColor: "white",
  },
});
