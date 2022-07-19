import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { database } from "../firebaseConfig/config";

export default function editUpload({ route }) {
  const [chnageName, setChnageName] = useState("");
  const [isNotError, setError] = useState(false);
  const [displayText, setText] = useState("");
  const [allUploads, setUploadList] = useState([]);

  // getting list of files  for edit -----
  useEffect(() => {
    database
      .ref("uploadFile")
      .once("value")
      .then((item) => {
        let uploads = [];
        item.forEach((childSnapshot) => {
          uploads.push(childSnapshot.val());
          setUploadList(uploads);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const validation = () => {
    if (!chnageName) {
      setError(true);
      console.log("error");
      setText("Empty Feilds...");
    } else {
      changeDetails();
    }
  };
  // edit user functionality here --------------
  const changeDetails = () => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    for (let i = 0; i < allUploads.length; i++) {
      if (allUploads[i].id == route.params.id) {
        console.log(allUploads[i].id + route.params.id);
        database
          .ref(`uploadFile/${allUploads[i].id}`)
          .set({
            id: allUploads[i].id,
            name: chnageName,
            fileUri: allUploads[i].fileUri,
            time: time,
          })
          .then(() => {
            console.log("Edit Upload File successful....");
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
          <Text style={styles.text}>Change File Label here !</Text>
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
