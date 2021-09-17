import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useState } from "react";
import { Input, Button, Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { auth, db } from "../../firebase/firebase";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Password Not Match",
        "Please make sure your passwords match.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          uid: authUser.user.uid,
          email: authUser.user.email,
        });
        db.collection("userInfo").doc(authUser.user.uid).set({
          email: email,
          photoURL: "",
          username: "",
          bio: "",
          posts: [],
          games: [],
          platforms: [],
        });
      })
      .catch((error) => alert(error));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={tw`bg-black flex-grow items-center justify-center`}>
        <TouchableOpacity
          style={[
            tw`absolute left-2 top-8`,
            { zIndex: 1, flexDirection: "row", alignItems: "center" },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="arrow-back-outline"
            type="ionicon"
            size={30}
            color="white"
          />
          <Text style={tw`text-white text-xl font-semibold ml-1`}>Back</Text>
        </TouchableOpacity>
        <KeyboardAvoidingView
          style={tw`w-full items-center`}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={tw`flex flex-grow items-center justify-center w-full p-10`}
          >
            <Input
              type="email"
              placeholder="Email"
              onChangeText={(email) => setEmail(email)}
              color="white"
              leftIcon={
                <Icon
                  name="mail-outline"
                  type="ionicon"
                  size={25}
                  style={{ marginRight: 5 }}
                  color="white"
                />
              }
            />
            <Input
              type="password"
              placeholder="Password"
              onChangeText={(password) => setPassword(password)}
              color="white"
              leftIcon={
                <Icon
                  name="lock-closed-outline"
                  type="ionicon"
                  size={25}
                  style={{ marginRight: 5 }}
                  color="white"
                />
              }
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              color="white"
              onChangeText={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              leftIcon={
                <Icon
                  name="lock-closed-outline"
                  type="ionicon"
                  size={25}
                  style={{ marginRight: 5 }}
                  color="white"
                />
              }
            />
            {console.log(email)}
            <Button
              type="outline"
              title="Register"
              disabled={(email && password && confirmPassword) ? false : true}
              style={{ width: 200 }}
              onPress={handleRegister}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({});
