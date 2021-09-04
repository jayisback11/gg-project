import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { useNavigation } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  if (!user) return <LoginScreen />;
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View>
        {/* Followed Icon */}
        {/* Search Icon */}
        {/* Chat Icon */}
      </View>

      {/* CENTER */}
      <View></View>

      {/* BOTTOM TABS => HOME and PROFILE */}
      <View>
        {/* HOME */}
        {/* PROFILE */}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0d0a36",
    flexGrow: 1,
  },
});
