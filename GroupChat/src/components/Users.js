import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { database } from "../firebaseConfig/config";
export default function About({ navigation }) {
  const [allUsers, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    users();
  }, []);
  const users = () => {
    database
      .ref("users")
      .once("value")
      .then((item) => {
        let users = [];
        item.forEach((childSnapshot) => {
          users.push(childSnapshot.val());
          setUsers(users);
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderLoader = () => {
    console.log("loader is rendered");
    return isLoading ? (
      <View>
        <ActivityIndicator size="large" color="red" />
      </View>
    ) : null;
  };

  // delete user functionality here -----------
  const deleteUser = (userID) => {
    let result = allUsers.filter((obj) => JSON.stringify(obj).includes(userID));
    for (let i = 0; i < allUsers.length; i++) {
      if (result[0].id == allUsers[i].id) {
        database.ref(`users/${allUsers[i].id}`).remove();
      }
    }
    users();
  };

  // edit user functionality here ---------
  const editUserUser = (userID) => {
    console.log("hello");
    navigation.navigate("edituser", { id: userID });
  };

  const ItemsView = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardContainer}>
          <Image source={item.image} style={styles.cardImage} />
          <View>
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.cardText}>{item.email}</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => deleteUser(item.id)}>
            <Text style={styles.button}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editUserUser(item.id)}>
            <Text style={[styles.button, styles.editButton]}>Edit</Text>
          </TouchableOpacity>
        </View>
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
    <View>
      <FlatList
        data={allUsers}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemsView}
        ListFooterComponent={renderLoader}
      ></FlatList>
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
    width: 60,
    height: 60,
    borderRadius: "50%",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 5,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#FA0309",
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 17,
    fontWeight: "600",
    borderRadius: 6,
    letterSpacing: 1.1,
  },
  editButton: {
    backgroundColor: "dodgerblue",
  },
});
