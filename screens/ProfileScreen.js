import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Button, Avatar } from "react-native-elements";
import { db, auth } from "../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import HorizontalSlider from "react-horizontal-slider";

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* top */}
      <View style={styles.topProfile}>
        <View style={tw` border-2 border-white rounded-full px-3 py-1`}>
          <Text style={tw`text-white text-2xl font-semibold text-center`}>
            jayisback11
          </Text>
        </View>
        <Text style={tw`text-white`}>Platform: PC, PS4</Text>
      </View>
      {/* bio */}
      <View style={styles.bioProfile}>
        <Text style={tw`text-white text-2xl text-center`}>Biography</Text>
        <Text style={tw`text-white text-base`}>
          lorem ipsum dolor sit amet, consecteturlorem ipsum dolorlorempis, sed
          diam nonum lorem ipsum lorem ipsum dolor lorem ipsum lorem ipsum lorem
          ipsum lorem ipsum
        </Text>
      </View>
      {/* games */}
      <View style={styles.gamesProfile}>
        <HorizontalSlider
          title="Menu 1"
          data={items1}
          height={300}
          width={300}
          id={1}
        />
      </View>
      {/* comments */}
      <View style={styles.commentsProfile}>
        <Avatar />
        <Text style={tw`text-white text-xl`}>Comments</Text>
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

      {/* BOTTOM NAV */}
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
    flexDirection: "row",
  },
  commentsProfile: {
    padding: 5,
  },
});
