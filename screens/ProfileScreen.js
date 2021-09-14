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
      <TouchableOpacity style={[tw`absolute top-7 right-3`, {zIndex: 1}]}>
        <Icon name="settings-outline" type="ionicon" size={35} color="white" />
      </TouchableOpacity>
      <View style={styles.top}>
        <View style={styles.topRight}>
          <Avatar
            rounded
            source={{
              uri: "https://static.wikia.nocookie.net/dota2_gamepedia/images/0/07/Arc_Warden_icon.png/revision/latest/scale-to-width-down/256?cb=20160411214723",
            }}
            width={100}
            height={100}
          />
          <View>
            <Text style={tw`text-white text-xl font-semibold ml-5`}>
              {user.username}
            </Text>
          </View>
        </View>
        <View style={styles.bio}>
          <Text numberOfLines={2} style={tw`text-white text-sm mt-3 `}>
            lorem ipsum dolor sit amet, consectetur adiplorem ipsum dolor sit
            amet, consectetur adiplorem ipsum dolor sit amet, consectetur
            adiplorem ipsum dolor sit amet, consectetur adip
          </Text>
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
    flex: 1,
  },
  top: {
    flex: 0.3,
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  bottom: {
    flex: 0.7,
  },
  topRight: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
