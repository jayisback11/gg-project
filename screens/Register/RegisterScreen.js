import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Input, Button } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase/firebase";

const Information = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [isDone, setIsDone] = useState({
    email: false,
    fullName: false,
    userAndPass: false,
  });

  const handleRegister = () => {
    auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((authUser) => {
        const fullName = `${userInfo.first_name} ${userInfo.last_name}`;
        authUser.user.updateProfile({
          displayName: fullName,
          uid: authUser.user.uid,
          email: authUser.user.email,
        });
        db.collection("userInfo").doc(authUser.user.uid).set({
          username: userInfo.username,
          bio: "No bio",
          platforms: "No platforms",
          profileURL: '',
        });
        navigation.navigate("AddGames");
      })
      .catch((error) => alert(error));
  };

  return (
    <SafeAreaView
      style={tw`bg-black flex-grow flex justify-center items-center`}
    >
      <View style={tw`absolute top-6 left-3`}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Icon
            name="arrow-back-outline"
            color="white"
            type="ionicon"
            size={35}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.container, isDone.email && styles.emailDone]}>
        <Input
          placeholder="Email"
          color="white"
          onChangeText={(email) => setUserInfo({ ...userInfo, email })}
        />
        <Button
          style={{ width: 200 }}
          title="Next"
          type="outline"
          onPress={() => {
            setIsDone({ ...isDone, email: true });
            Keyboard.dismiss();
          }}
        />
      </View>
      <View
        style={[
          styles.container,
          { right: -400 },
          isDone.email && styles.nameNext,
          isDone.fullName && { right: -400 },
        ]}
      >
        <Input
          placeholder="First Name"
          onChangeText={(first_name) =>
            setUserInfo({ ...userInfo, first_name })
          }
        />
        <Input
          placeholder="Last Name"
          onChangeText={(last_name) => setUserInfo({ ...userInfo, last_name })}
        />
        <Button
          title="Next"
          style={{ width: 200, marginBottom: 10 }}
          onPress={() => setIsDone({ ...isDone, fullName: true })}
        />
        <Button
          title="Back"
          style={{ width: 200 }}
          type="outline"
          onPress={() => setIsDone({ ...isDone, email: false })}
        />
      </View>

      <View
        style={[
          styles.container,
          { right: -400 },
          isDone.email && isDone.fullName && styles.nameNext,
        ]}
      >
        <Input
          placeholder="Username"
          onChangeText={(username) => setUserInfo({ ...userInfo, username })}
        />
        <Input
          placeholder="Password"
          onChangeText={(password) => setUserInfo({ ...userInfo, password })}
        />
        <Button
          title="Next"
          style={{ width: 200, marginBottom: 10 }}
          onPress={handleRegister}
        />
        <Button
          title="Back"
          style={{ width: 200 }}
          type="outline"
          onPress={() => setIsDone({ ...isDone, fullName: false })}
        />
      </View>
    </SafeAreaView>
  );
};

export default Information;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "80%",
    width: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emailDone: {
    left: -400,
  },
  nameNext: {
    right: "auto",
  },
});
