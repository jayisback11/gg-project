import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Information from './Information'
const Stack = createNativeStackNavigator();

const RegisterScreen = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="Information" component={Information} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
