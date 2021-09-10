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
  const dispatch = useDispatch()

  useEffect(() => {
    db.collection("userGames")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        setGames(doc.data().gamesAdded);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* top */}
      <View style={styles.topProfile}>
        <TouchableOpacity
          style={tw` border-2 border-white rounded-full px-3 py-1`}
          onPress={() => {
            auth.signOut();
            dispatch(logout(null))
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
        >
          <Text style={tw`text-white text-2xl font-semibold text-center`}>
            {user.username}
          </Text>
        </TouchableOpacity>
        <Text style={tw`text-white`}>Platform: PC, PS4</Text>
      </View>
      {/* bio */}
      <View style={styles.bioProfile}>
        <TouchableOpacity style={[tw`absolute right-2 top-1`, { zIndex: 1 }]}>
          <Icon name="create-outline" type="ionicon" color="white" size={35} />
        </TouchableOpacity>
        <Text style={tw`text-white text-2xl text-center font-semibold`}>
          Biography
        </Text>
        <Text style={tw`text-white text-base`}>
          lorem ipsum dolor sit amet, consecteturlorem ipsum dolorlorempis, sed
          diam nonum lorem ipsum lorem ipsum dolor lorem ipsum lorem ipsum lorem
          ipsum lorem ipsum
        </Text>
      </View>
      {/* games */}
      <View style={styles.gamesProfile}>
        <Text style={tw`text-white text-2xl text-center`}>Games</Text>
        <ScrollView>
          <View style={styles.gamesContainer}>
            {Object.values(games).map((game) => (
              <TouchableOpacity
                style={tw`mx-1 border-b-2 border-white `}
                key={game.id}
              >
                <Text style={tw`text-white text-center`}>{game.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      {/* comments */}
      <View style={styles.commentsProfile}>
        <Avatar />
        <Text style={tw`text-white text-2xl text-center`}>Comments</Text>
      </View>
      {/* LOG OUT */}
      {/* <Button
        title="Log Out"
        onPress={() => {
          auth.signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }}
      /> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  topProfile: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  bioProfile: {
    flex: 0.3,
    padding: 10,
  },
  gamesProfile: {
    flex: 0.3,
    flexDirection: "column",
    padding: 5,
  },
  commentsProfile: {
    padding: 5,
  },
  gamesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
