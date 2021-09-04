import React from "react";
import { SafeAreaView, StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Button
        title="register"
        onPress={() => navigation.navigate("RegisterScreen")}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
