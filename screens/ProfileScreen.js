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
      <View style={styles.top}>
        <Avatar
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS8P7S393c1aD_xwVNO9UTPWI10JccFYv3nZBpNJLwlQaSmZnWoFFZeDoZXXno3j87uXg&usqp=CAU",
          }}
          width={100}
          height={100}
          rounded={true}
        />
        <View style={styles.topInfo}>
          <View style={tw`border-b-2 border-red-600 m-2`}>
            <Text style={tw`text-white text-sm`}>{user?.username}</Text>
          </View>
          <Text style={tw`text-white text-xs`}>Red Dead Redemption 2</Text>
          <View style={styles.bio}>
            <Text style={tw`text-white text-sm`}>Bio:</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <ScrollView></ScrollView>
      </View>
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
