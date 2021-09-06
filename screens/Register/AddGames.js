import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import tw from "tailwind-react-native-classnames";
import {SearchBar} from 'react-native-elements'
const AddGames = () => {
  return (
    <SafeAreaView style={tw`flex-grow bg-black items-center justify-center`}>
      <View>
        <SearchBar/>
      </View>
    </SafeAreaView>
  );
};

export default AddGames;

const styles = StyleSheet.create({});
