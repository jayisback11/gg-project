import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import tw from "tailwind-react-native-classnames";
import { SearchBar, Icon } from "react-native-elements";
import { debounce } from "lodash";

const SearchScreen = () => {
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");

  const deb = useCallback(
    debounce((text) => {
      setSearch(text);
    }, 1000),
    []
  );
  const handleSearch = (text) => {
    setText(text);
    deb(text);
  };
  return (
    <SafeAreaView>
      <View>
        <SearchBar
          placeholder="Search Players..."
          value={text}
          lightTheme={true}
          containerStyle={{
            backgroundColor: "transparent",
            borderTopWidth: "none",
            borderBottomWidth: "none",
          }}
          inputContainerStyle={{ backgroundColor: "white" }}
          inputStyle={{ color: "black" }}
          placeholderTextColor="black"
          searchIcon={
            <Icon
              name="search-outline"
              type="ionicon"
              color="black"
              size={30}
            />
          }
          onChangeText={(text) => handleSearch(text)}
        />
      </View>
      {search ? (
          <Text style={tw`text-white`}>search is filled {search}</Text>
      ):(
          <Text style={tw`text-white`}>search is empty</Text>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
