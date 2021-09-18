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
import { SearchBar, Button, Icon, Image } from "react-native-elements";
import { API_KEY } from "@env";
import { debounce } from "lodash";
import { db, auth } from "../../firebase/firebase";
import { useNavigation } from "@react-navigation/native";

const AddGames = ({ route }) => {
  const navigation = useNavigation();
  const [availableGames, setAvailableGames] = useState([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [gamesAdded, setGamesAdded] = useState([]);

  const deb = useCallback(
    debounce((text) => {
      setSearch(text);
      console.log("b");
    }, 1000),
    []
  );
  console.log("text", route.params.currentGames);
  const handleSearch = (text) => {
    setText(text);
    deb(text);
  };

  const handleGameAdd = (game) => {
    setGamesAdded((oldArray) => [
      ...oldArray,
      { name: game.name, backgroundImage: game.background_image },
    ]);
  };

  const handleDelete = (item) => {
    setGamesAdded(
      gamesAdded.filter((game) => {
        return game !== item.name;
      })
    );
  };

  const handleSubmit = () => {
    db.collection("userInfo")
      .doc(auth.currentUser.uid)
      .set({ games: gamesAdded }, { merge: true })
      .then(() => {
        navigation.replace("Main");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    async function fetchGames() {
      const result = await fetch(
        `https://api.rawg.io/api/games?key=d321e70532c843fca84e97ff4f126e57&search=${search}&ordering=-rating&search_precise=true&exclude_additions=true`
      )
        .then((response) => response.json())
        .then((data) => setAvailableGames(JSON.parse(JSON.stringify(data))));
    }
    if (search) {
      fetchGames();
    }
  }, [search]);
  console.log(availableGames);
  return (
    <SafeAreaView style={styles.homeScreen}>
      <View style={styles.homeScreenContainer}>
        {gamesAdded.length != 0 && (
          <TouchableOpacity
            style={[
              tw`absolute top-2 text-red-500 right-4 border-2 rounded-full border-green-500 bg-green-500 p-2 px-4`,
              { zIndex: 1 },
            ]}
            onPress={handleSubmit}
          >
            <Text style={tw`text-white text-lg`}>Next</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headingText}>Select your games...</Text>
        <View>
          <SearchBar
            placeholder="Search Games..."
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
          <Text style={tw`text-white text-lg text-xl pl-4`}>
            Press game to add
          </Text>
        ) : (
          <Text style={tw`text-white text-lg text-xl pl-4`}>
            Press game to remove
          </Text>
        )}
        {/* FlatList */}
        <View style={tw`mb-2`} />
        {search ? (
          <FlatList
            data={availableGames.results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              if (gamesAdded.includes(item)) {
                return null;
              }
              return (
                <TouchableOpacity
                  style={tw`p-5 rounded-lg mx-5 my-1 border-2 border-gray-600`}
                  onPress={() => handleGameAdd(item)}
                >
                  <Image
                    source={{ uri: item.background_image }}
                    style={{ width: "100%", height: 200, resizeMode: "cover" }}
                  />
                  <Text style={[tw`text-white text-center text-lg`]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <FlatList
            data={gamesAdded}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 20,
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 10,
                  marginBottom: 5,
                  borderWidth: 2,
                  borderColor: "gray",
                  borderRadius: 10,
                }}
                onPress={() => handleDelete(item)}
              >
                <Image
                  source={{ uri: item.background_image }}
                  style={{
                    width: "100%",
                    height: 100,
                    resizeMode: "cover",
                    backgroundColor: "transparent",
                  }}
                />
                <Text style={[tw`text-white text-center text-lg`]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddGames;

const styles = StyleSheet.create({
  homeScreen: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
  homeScreenContainer: {
    width: "100%",
    height: "100%",
    padding: 5,
  },
  headingText: {
    fontSize: 40,
    color: "white",
    padding: 10,
  },
});
