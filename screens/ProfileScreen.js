import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Avatar, Image, Icon } from "react-native-elements";
import { db, auth } from "../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import HorizontalSlider from "react-horizontal-slider";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../slices/userSlice";
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [games, setGames] = useState([]);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleSignOut = () => {
    auth.signOut();
    dispatch(logout(null));
    navigation.replace("Login");
  };

  useEffect(() => {
    db.collection("userGames")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        setGames(doc.data().games);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={[tw`absolute top-6 right-2`, {zIndex: 1}]} onPress={() => navigation.navigate('Settings')}>
        <Icon name="settings-outline" type="ionicon" size={35} color="white"/>
      </TouchableOpacity>
      <View style={styles.top}>
        <Avatar
          source={{
            uri:
              user?.profileURL ||
              "https://cdn.dribbble.com/users/295073/screenshots/5081089/hacker_logo_v1.0.jpg?compress=1&resize=400x300",
          }}
          width={100}
          height={100}
          rounded={true}
        />
        <View style={styles.topInfo}>
          <View style={tw``}>
            <Text style={tw`text-white text-lg`}>{user?.username}</Text>
          </View>
          <View style={styles.bio}>
            <Text style={tw`text-white text-sm`}>Bio:{user.bio}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <ScrollView></ScrollView>
      </View>
      <Button title="Log out" onPress={() => handleSignOut()} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  top: {
    flex: 0.3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "red",
  },
  bottom: {
    flex: 0.7,
    borderWidth: 1,
    borderColor: "green",
  },
  topInfo: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
    height: "50%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bio: {
    color: "white",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
});
