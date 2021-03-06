import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Input, Button, Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { db, auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { login, logout } from "../slices/userSlice";
import * as Notifications from "expo-notifications";
import { reduxSetNotification } from "../slices/notificationSlice";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [user, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => {
  //     console.log(token);
  //     setExpoPushToken(token);
  //     dispatch(reduxSetNotification({ token }));
  //   });

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser || null) {
        db.collection("userInfo")
          .doc(authUser.uid)
          .get()
          .then((docInfo) => {
            dispatch(login(docInfo.data()));
          });
        navigation.replace("Main");
      } else {
        dispatch(logout(null));
      }
    });
  }, []);

  const [loaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(user, password)
      .catch((error) => alert(error));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[tw`bg-black flex-grow justify-center`]}>
        <ImageBackground
          source={require("../assets/images/loginBackgroundImage.jpg")}
          resizeMode="cover"
          style={[styles.image, { alignItems: "center" }]}
        >
          <KeyboardAvoidingView
            style={tw`w-full items-center`}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={[
                {
                  backgroundColor: "rgba(15, 15, 15, 0.8)",
                  width: "75%",
                  borderRadius: 20,
                },
              ]}
            >
              <View style={tw`items-center flex justify-center p-5`}>
                <Text
                  style={[
                    tw`text-white text-4xl font-semibold mb-5`,
                    { fontFamily: "PressStart2P", fontSize: 30 },
                  ]}
                >
                  welcome
                </Text>
                <Input
                  color="white"
                  placeholder="Email"
                  type="text"
                  onChangeText={(user) => setUsername(user)}
                />
                <Input
                  color="white"
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
                <Button
                  style={{ width: 200, marginBottom: 10, marginTop: 5 }}
                  ViewComponent={LinearGradient}
                  title="Login"
                  onPress={handleLogin}
                  linearGradientProps={{
                    colors: ["purple", "blue"],
                    start: { x: 0, y: 0.5 },
                    end: { x: 1, y: 0.5 },
                  }}
                  icon={
                    <Icon
                      name="arrow-forward-circle-outline"
                      type="ionicon"
                      size={25}
                      color="white"
                    />
                  }
                />
                <Button
                  style={{ width: 200 }}
                  type="outline"
                  title="Register"
                  onPress={() => navigation.navigate("Register")}
                />
              </View>
            </View>
            <View style={tw`mb-10`} />
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    top: 0,
    right: 0,
  },
});
