import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { database } from "../firebaseConfig/config";
import * as navigationRef from "../routs/RootNavigation";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNotError, setError] = useState(false);
  const [displayText, setText] = useState("");
  const [allUsers, setUsers] = useState([]);

  const validation = () => {
    let dot = email.indexOf(".");
    let atrate = email.indexOf("@");
    if (!email || !password) {
      setError(true);
      setText("Feilds Cannot be Empty...");
    } else if (dot < 1 || dot - atrate < 2) {
      setError(true);
      setText("Invalid Email...");
    } else {
      loginSuccess();
    }
  };

  const loginSuccess = () => {
    let result = allUsers.filter((obj) => JSON.stringify(obj).includes(email));
    if (result.length !== 0) {
      let curMail = result[0].email;
      let curPassword = result[0].password;
      if (curMail == email && curPassword == password) {
        currentUserHandeler(result);
        navigation.navigate("drawer");
      } else {
        alert("Invalid Password....");
      }
    } else {
      alert("User not found / invalid Email !");
    }
  };

  // creating current user ----------
  const currentUserHandeler = (result) => {
    console.log(result);
    if (result.length !== 0) {
      database
        .ref("currentUser")
        .set({
          id: result[0].id,
          name: result[0].name,
          email: result[0].email,
          password: result[0].password,
          image: result[0].image,
        })
        .then(() => {
          alert("Login success...");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={require("../assets/Netflix-Background.jpg")}
          style={{ width: "100vw", height: "100vh" }}
        />
      </View>
      <View style={styles.backdrop}></View>
      <View style={styles.loginForm}>
        {isNotError ? (
          <Text style={styles.text}>{displayText}</Text>
        ) : (
          <Text style={styles.text}>Enter Email and Password to Login..</Text>
        )}
        <View style={styles.inputContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.text}>Email *</Text>
            <TextInput
              placeholder="eg. jatin@gmail.com"
              style={styles.feild}
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.text}>Password *</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="password"
              style={styles.feild}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
          </View>
        </View>
        <TouchableOpacity onPress={validation}>
          <Text style={styles.button}>Login</Text>
        </TouchableOpacity>
        <View style={styles.flexRow}>
          <Text style={styles.text}>Do not have an accout ?</Text>
          <TouchableOpacity onPress={() => navigationRef.navigate("signup")}>
            <Text style={[styles.text, { color: "#FA0309" }]}>SignUP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  loginForm: {
    position: "fixed",
    width: "100%",
    top: "15%",
    left: "-50%",
    gap: "2rem",
    transform: "translate(50%)",
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
  backdrop: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    opacity: 0.6,
  },
});
