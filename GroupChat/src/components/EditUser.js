import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../firebaseConfig/config";

export default function EditUser({ route }) {
  const [chnageEmail, setChangeEmail] = useState("");
  const [chnageName, setChnageName] = useState("");
  const [isNotError, setError] = useState(false);
  const [displayText, setText] = useState("");
  const [currentUser, setCurrentUser] = useState([]);
  const [allUsers, setUsers] = useState([]);

  // getting users for edit -----
  useEffect(() => {
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
      });
  }, []);

  // getting current user for edit
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
      });
  }, []);

  const validation = () => {
    if (!chnageEmail && !chnageName) {
      setError(true);
      console.log("error");
      setText("Empty Feilds...");
    } else {
      changeDetails();
    }
  };
  // edit user functionality here --------------
  const changeDetails = () => {
    const curUser = currentUser[0];
    console.log(allUsers[0].id);
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].id == route.params.id) {
        database
          .ref(`users/${allUsers[i].id}`)
          .set({
            id: allUsers[i].id,
            name: chnageName,
            email: chnageEmail,
            password: allUsers[i].password,
            confirmPswd: allUsers[i].confirmPswd,
            image: allUsers[i].image,
          })
          .then(() => {
            console.log("Edit User successful....");
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if (curUser.id == route.params.id) {
        // if edit user is same then current user will also be Updated
        database
          .ref(`currentUser`)
          .set({
            id: curUser.id,
            name: chnageName,
            email: chnageEmail,
            password: curUser.password,
            image: curUser.image,
          })
          .then(() => {
            console.log("Edit CurrentUser is also  successful....");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  return (
    <View>
      <View style={styles.loginForm}>
        {isNotError ? (
          <Text style={styles.text}>{displayText}</Text>
        ) : (
          <Text style={styles.text}>Chnage your name and email here...</Text>
        )}
        <View style={styles.inputContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.text}>Name *</Text>
            <TextInput
              placeholder="name"
              style={styles.feild}
              onChangeText={(text) => setChnageName(text)}
              value={chnageName}
            />
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.text}>Email *</Text>
            <TextInput
              placeholder="eg. jatin@gmail.com"
              style={styles.feild}
              onChangeText={(text) => setChangeEmail(text)}
              value={chnageEmail}
            />
          </View>
        </View>
        <TouchableOpacity onPress={validation}>
          <Text style={styles.button}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
    fontSize: 20,
  },
  loginForm: {
    marginTop: 30,
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  feild: {
    backgroundColor: "white",
    height: 40,
    minWidth: "250px",
    padding: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  button: {
    color: "white",
    backgroundColor: "#FA0309",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: "700",
    borderRadius: 4,
    letterSpacing: 1.2,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: "1rem",
  },
  inputContainer: {
    gap: "1rem",
  },
});
