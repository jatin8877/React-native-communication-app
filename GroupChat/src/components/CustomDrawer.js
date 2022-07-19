import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../firebaseConfig/config";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import * as navigationRef from "../routs/RootNavigation";

import Icons from "react-native-vector-icons/Ionicons";

export default function CustomDrawer(props) {
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    database
      .ref("currentUser")
      .once("value")
      .then((item) => {
        let users = [];
        users.push(item.val());
        setCurrentUser(users);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);
  // ----------edit user ----------
  const editUser = (userID) => {
    console.log(userID);
    console.log("hello");
    // props.navigation.navigate("edituser", { id: userID });
  };
  //----------- logout user---------
  const logout = () => {
    database.ref("currentUser").remove();
    navigationRef.navigate("login");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={require("../assets/drawer-background.jpg")}
          style={{ padding: 25 }}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={editUser(currentUser[0].id)}>
                <Image
                  source={currentUser[0].image}
                  style={styles.profilePic}
                />
              </TouchableOpacity>
              <Text style={styles.profileName}>
                {"Welcome " + currentUser[0].name}
              </Text>
            </View>
          )}
        </ImageBackground>
        <View style={styles.drawerContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={() => logout()}>
          <View style={styles.logout}>
            <Icons name="exit-outline" size={24} />
            <Text style={{ fontSize: 18 }}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderColor: "dodgerblue",
    borderWidth: 3,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  profileName: {
    color: "white",
    fontSize: 19,
    fontWeight: "500",
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  logout: {
    flexDirection: "row",
    gap: 5,
  },
});
