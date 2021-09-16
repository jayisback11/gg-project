import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useState } from "react";
import { Input, Button, Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { auth, db } from "../../firebase/firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
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
    <SafeAreaView style={tw`bg-black flex-grow items-center justify-center`}>
      <View style={tw`flex flex-grow items-center justify-center w-full p-10`}>
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
          onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
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
        <Button type="outline" title="Register" style={{ width: 200 }} onPress={handleRegister}/>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({});
