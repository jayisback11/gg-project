import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Input, Button } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const Information = () => {
    const navigation = useNavigation()
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  return (
    <SafeAreaView style={tw`bg-black flex-grow flex justify-center`}>
      <View style={tw`absolute top-6 left-3`}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Icon
            name="arrow-back-outline"
            color="white"
            type="ionicon"
            size={35}
          />
        </TouchableOpacity>
      </View>
      <View style={{ display: 'flex', padding: 20, alignItems: 'center' }}>
        <Input placeholder="First Name" />
        <Input placeholder="Last Name" />
        <Input placeholder="Email" />
        <Input placeholder="Username" />
        <Input placeholder="Password" />
        <Input placeholder="Confirm Password" />
        <Button style={{width: 200}}title="Next" type="outline"/>
      </View>
    </SafeAreaView>
  );
};

export default Information;

const styles = StyleSheet.create({});
