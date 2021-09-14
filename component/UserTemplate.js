import React from "react";
import { StyleSheet, Text, View } from "react-native";

const UserTemplate = ({ avatarURL, username, games }) => {
  return (
    <View>
      <Avatar />
      <View>
        <Text style={tw`text-white`}>Username</Text>
        <View>
            <Text style={tw`text-white`}>games logo</Text>
        </View>
      </View>
    </View>
  );
};

export default UserTemplate;

const styles = StyleSheet.create({});
