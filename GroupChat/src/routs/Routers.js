import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import DrawerHandeler from "./Drawers";
import { navigationRef } from "./RootNavigation";
import { database } from "../firebaseConfig/config";
import EditUser from "../components/EditUser";
import editUpload from "../components/editUpload";

const Stack = createStackNavigator();

export default function Routers() {
  const [isUserExists, setUserExists] = useState([]);

  useEffect(() => {
    database
      .ref("currentUser")
      .once("value")
      .then((item) => {
        let users = [];
        users.push(item.val());
        setUserExists(users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={isUserExists.length == 0 ? "login" : "drawer"}
        >
          <Stack.Screen
            name="signup"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="drawer"
            component={DrawerHandeler}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="edituser" component={EditUser} />
          <Stack.Screen name="editupload" component={editUpload} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
