import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as navigationRef from "../routs/RootNavigation";
import { database } from "../firebaseConfig/config";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPswd, setConfirmPswd] = useState("");
  const [isNotError, setError] = useState(false);
  const [displayText, setText] = useState("");
  const [allUsers, setUsers] = useState([]);
  // Image picker
  const [hasGalleryPermission, setGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    (async () => {
      const gallaryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(gallaryStatus.status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.6,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasGalleryPermission == false) {
    return <Text>Access Denied from Galary..</Text>;
  }

  //! image is picked above

  // getting user from Firebase
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

  //validation user
  const validation = () => {
    let dot = email.indexOf(".");
    let atrate = email.indexOf("@");
    if (!email || !password || !confirmPswd || !name) {
      setError(true);
      setText("Empty Feilds...");
    } else if (dot < 1 || dot - atrate < 2) {
      setError(true);
      setText("Invalid Email Input...");
    } else if (password != confirmPswd) {
      setError(true);
      setText("Password and Confirm password does not match...");
    } else if (!image) {
      setError(true);
      setText("User Image is Mandatory..!");
    } else {
      signUpUser();
    }
  };

  // signup user if it not already exists
  const signUpUser = () => {
    let result = allUsers.filter((obj) => JSON.stringify(obj).includes(email));
    console.log(result);
    if (result.length == 0) {
      const data = {
        id: Number(new Date()),
        name: name,
        email: email,
        password: password,
        confirmPswd: confirmPswd,
        image: image,
      };
      database
        .ref("users")
        .update({ [data.id]: data })
        .then(() => {
          alert("Registeration success...");
        })
        .catch((err) => {
          console.log(err);
        });
      setError(false);
      navigationRef.navigate("login");
    } else {
      alert("user already exists..");
    }
  };

  // User Interface (UI) for Register
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
          <Text style={styles.errorText}>{displayText}</Text>
        ) : (
          <Text style={styles.text}>Enter Details Below to Register</Text>
        )}
        <View style={styles.inputContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.text}>Name *</Text>
            <TextInput
              placeholder="eg. Jatin"
              style={styles.feild}
              onChangeText={(text) => setName(text)}
              value={name}
            />
          </View>
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
          <View style={styles.flexRow}>
            <Text style={styles.text}>Confirm *</Text>
            <TextInput
              secureTextEntry={true}
              placeholder="password"
              style={styles.feild}
              onChangeText={(text) => setConfirmPswd(text)}
              value={confirmPswd}
            />
          </View>
          <View style={styles.flexRow}>
            {image ? (
              <Text style={styles.text}>Image Picked successfully</Text>
            ) : (
              <Text style={styles.text}>Please Pick an Image</Text>
            )}
            <Button title="Pick Image" onPress={() => pickImage()} />
          </View>
        </View>
        <TouchableOpacity onPress={validation}>
          <Text style={styles.button}>Register</Text>
        </TouchableOpacity>
        <View style={styles.flexRow}>
          <Text style={styles.text}>Already have an accout ?</Text>
          <TouchableOpacity onPress={() => navigationRef.navigate("login")}>
            <Text style={[styles.text, { color: "#FA0309" }]}>Login</Text>
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
  backdrop: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    opacity: 0.6,
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
  text: {
    color: "white",
    fontSize: 20,
  },
  errorText: {
    color: "red",
    fontSize: 20,
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
  image: {
    position: "fixed",
  },
});
