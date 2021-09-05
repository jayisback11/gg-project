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

const LoginScreen = () => {
  const [user, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Main");
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
      <SafeAreaView style={tw`bg-black flex-grow justify-center`}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={tw`items-center flex justify-center p-5`}>
            <Text style={tw`text-white text-4xl font-semibold mb-5`}>Login</Text>
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
