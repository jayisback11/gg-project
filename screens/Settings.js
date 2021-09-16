import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SettingsOptions from './SettingsOptions'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const Settings = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsOptions"
        component={SettingsOptions}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Settings;

const styles = StyleSheet.create({});
