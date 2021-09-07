import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { SearchBar, Button, CheckBox, Icon } from "react-native-elements";
import { CLIENT_ID, CLIENT_SECRET } from "@env";
import { debounce } from "lodash";

const AddGames = () => {
  const [availableGames, setAvailableGames] = useState([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");

  const deb = useCallback(
    debounce((text) => {
      setSearch(text);
      console.log("b");
    }, 500),
    []
  );
  const handleSearch = (text) => {
    setText(text);
    deb(text);
  };

  useEffect(() => {
    async function fetchGames() {
      const result = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          return fetch("https://api.igdb.com/v4/search", {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
              "Client-ID": "otgkagowpkftrpvtyw09m6fu5gcxmp",
              Authorization: `Bearer ${data.access_token}`,
            },
            body: `fields *; search "${search}"; limit 25;`,
          });
        })
        .then((res) => res.json())
        .then((data) => setAvailableGames(data))
        .catch((error) => alert(error));
    }
    fetchGames();
  }, [search]);

  return (
    <SafeAreaView style={tw`flex-grow bg-black`}>
      <View style={tw`px-3 pt-1`}>
        <Text style={styles.headingText}>Select your games...</Text>

        <View>
          <SearchBar
            placeholder="Search Games..."
            value={text}
            lightTheme={true}
            containerStyle={{ backgroundColor: "transparent", borderTopWidth: "none", borderBottomWidth: "none"}}
            inputContainerStyle={{backgroundColor: 'white'}}
            inputStyle={{color: 'black'}}
            placeholderTextColor="black"
            searchIcon={<Icon name="search-outline" type="ionicon" color="black" size={30}/>}
            onChangeText={(text) => handleSearch(text)}
          />
        </View>
        <View>
          <FlatList
            data={availableGames}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              if (!search) {
                return null;
              } else if (
                item.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return (
                  <View key={item.id} style={styles.itemContainer}>
                    <Text style={tw`text-white text-lg w-3/4`}>
                      {item.name}
                    </Text>
                    <TouchableOpacity>
                      <Icon
                        name="add-outline"
                        type="ionicon"
                        size={35}
                        color="green"
                        style={tw`rounded-full bg-white`}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddGames;

const styles = StyleSheet.create({
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "white",
    margin: 10,
    padding: 10,
  },
  headingText: {
    fontSize: 40,
    color: "white",
    padding: 10,
  },
});
