import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Input, Button } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { db, auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { login } from "../slices/userSlice";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [user, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        db.collection("userInfo")
          .doc(authUser.uid)
          .get()
          .then((docInfo) => {
            dispatch(login(docInfo.data()));
          });
        db.collection("userGames")
          .doc(authUser.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              navigation.replace("Main");
            } else {
              navigation.replace("AddGames");
            }
          });
      }
    });
  }, []);

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(user, password)
      .catch((error) => alert(error));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={tw`bg-black flex-grow justify-center`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={tw`items-center flex justify-center p-5`}>
            <Text style={tw`text-white text-4xl font-semibold mb-5`}>
              Login
            </Text>
            <Input
              color="white"
              placeholder="Username"
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
              title="Login"
              onPress={handleLogin}
            />
            <Button
              style={{ width: 200 }}
              type="outline"
              title="Register"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
          <View style={tw`mb-10`} />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
