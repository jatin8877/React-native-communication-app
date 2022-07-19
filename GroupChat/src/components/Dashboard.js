import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const [filterdData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("current Page " + currentPage);
    fetch(`https://randomuser.me/api/?page=${currentPage}&results=10`)
      .then((response) => response.json())
      .then((data) => {
        setFilteredData(data.results);
        // setMasterData(data.results);
        setMasterData([...masterData, ...data.results]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  const searchFilteredData = (text) => {
    if (text) {
      const newData = masterData.filter((item) => {
        const itemData = `${item.name.first} ${item.name.last}`
          ? `${item.name.first.toUpperCase()}${item.name.last.toUpperCase()}`
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(masterData);
      setSearch(text);
    }
  };
  const renderLoader = () => {
    console.log("loader is rendered");
    return isLoading ? (
      <View>
        <ActivityIndicator size="large" color="red" />
      </View>
    ) : null;
  };
  // const loadMoreItems = () => {
  //   console.log("load more items");
  //   setCurrentPage(currentPage + 1);
  // };

  const ItemsView = ({ item }) => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardContainer}>
          <Image source={item.picture.medium} style={styles.cardImage} />
          <Text style={styles.cardText}>
            {item.name.first + " " + item.name.last}
          </Text>
        </View>
        <Text>{time}</Text>
      </View>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "grey",
        }}
      />
    );
  };

  return (
    <View style={{ height: "100%", overflow: "scroll" }}>
      <SafeAreaView>
        <TextInput
          style={styles.searchInputStyle}
          value={search}
          placeholder="Search Here"
          underlineColorAndroid="transparent"
          onChangeText={(text) => searchFilteredData(text)}
        />
        <ScrollView>
          <FlatList
            data={filterdData}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            // onEndReached={loadMoreItems}
            // onEndReachedThreshold={0}
            renderItem={ItemsView}
            ListFooterComponent={renderLoader}
          ></FlatList>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  cardText: {
    marginLeft: 14,
    fontSize: 18,
    color: "#0f0f0f",
  },

  searchInputStyle: {
    height: 40,
    borderColor: "#FA0309",
    borderWidth: 1,
    paddingLeft: 20,
    margin: 8,
    backgroundColor: "white",
    borderRadius: "30px",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: "50%",
  },
});
