import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { database } from "../firebaseConfig/config";
import Icons from "react-native-vector-icons/Ionicons";

export default function Upload({ navigation }) {
  const [fileName, setFileName] = useState("");
  const [fileUri, setFileUri] = useState("");
  const [allUploads, setUploads] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [displayText, setText] = useState("");
  const [isNotError, setError] = useState(false);

  const docPickerHandeler = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*pdf/*",
    });
    if (!result.cancelled) {
      setFileName(result.file.name);
      setFileUri(result.uri);
      setText(result.file.name);
      setError(true);
    }
  };

  const storeFileToDatabase = () => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!fileName && !fileUri) {
      setError(true);
      setText("Choose a file first!");
      return;
    }
    const data = {
      id: Number(new Date()),
      name: fileName,
      fileUri: fileUri,
      time: time,
    };
    database
      .ref("uploadFile")
      .update({ [data.id]: data })
      .then(() => {
        console.log("Upload Successfull...");
      })
      .catch((err) => {
        console.log(err);
      });
    setFileUri("");
    setFileName("");
    setError(true);
    setText("File Upload Success....");
  };

  // getting all uploads from firebase here
  useEffect(() => {
    uploads();
  }, []);
  const uploads = () => {
    database
      .ref("uploadFile")
      .once("value")
      .then((item) => {
        let uploads = [];
        item.forEach((childSnapshot) => {
          uploads.push(childSnapshot.val());
          setUploads(uploads);
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // loaderr --------------------------
  const renderLoader = () => {
    console.log("loader is rendered");
    return isLoading ? (
      <View>
        <ActivityIndicator size="large" color="red" />
      </View>
    ) : null;
  };

  // delete upload functionality here -----------
  const deleteUpload = (userID) => {
    let result = allUploads.filter((obj) =>
      JSON.stringify(obj).includes(userID)
    );
    for (let i = 0; i < allUploads.length; i++) {
      if (result[0].id == allUploads[i].id) {
        database.ref(`uploadFile/${allUploads[i].id}`).remove();
        alert("File Deleted successfully...");
      }
    }
    uploads();
  };

  // edit user functionality here ---------
  const editFile = (userID) => {
    console.log("hello");
    navigation.navigate("editupload", { id: userID });
  };

  //--------------- share file to social media -------------
  const onShare = async (userID) => {
    // let result = allUploads.filter((obj) =>
    //   JSON.stringify(obj).includes(userID)
    // );
    // for (let i = 0; i < allUploads.length; i++) {
    //   if (result[0].id == allUploads[i].id) {
    //   }
    // }
    try {
      const file = await Share.share({
        // url: allUploads[i].fileUri,
        message: "I am a React Developer.",
      });
    } catch (error) {
      alert(error.message);
    }
  };
  // ---------- Items component -----------
  const ItemsView = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardContainer}>
          <View>
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.cardText}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => deleteUpload(item.id)}>
            <Icons name="trash" style={styles.button} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editFile(item.id)}>
            <Icons
              name="create-outline"
              style={[styles.button, styles.editButton]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onShare(item.id);
            }}
          >
            <Icons
              name="md-share"
              style={[styles.button, styles.shareButton]}
            />
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
    <View style={styles.container}>
      <View style={styles.container}>
        <ScrollView>
          <FlatList
            data={allUploads}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemsView}
            ListFooterComponent={renderLoader}
          ></FlatList>
        </ScrollView>
      </View>
      <View style={styles.pickUploadContainer}>
        {isNotError ? (
          <Text style={{ fontSize: 20 }}>{displayText}</Text>
        ) : (
          <Text style={{ fontSize: 20 }}>Upload a file !</Text>
        )}
        <View style={styles.uploadBtns}>
          <TouchableOpacity onPress={docPickerHandeler}>
            <Text style={styles.Btn}>Pick Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={storeFileToDatabase}>
            <Text style={styles.Btn}>Upload Doc</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ------------ Styles ---------------
const styles = StyleSheet.create({
  container: { flex: 1, height: "100%", width: "100%" },
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
  shareButton: {
    backgroundColor: "#02d6ac",
  },
  uploadBtns: {
    justifyContent: "center",
    flexDirection: "row",
    gap: "2rem",
  },

  Btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    backgroundColor: "#02d6ac",
    fontSize: 19,
    fontWeight: "600",
    borderRadius: 6,
    letterSpacing: 1.1,
    width: 130,
    height: 60,
    borderWidth: 4,
    borderColor: "#02bd99",
  },
  pickUploadContainer: {
    alignItems: "center",
    gap: 10,
    width: "100%",
    borderTopColor: "grey",
    borderTopWidth: 1,
  },
});
