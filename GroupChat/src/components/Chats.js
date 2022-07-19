import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { database } from "../firebaseConfig/config";

export default function Chats() {
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatRoom, setChatRoom] = useState([]);

  const validation = () => {
    if (!message) {
      console.log("Empty Feild...");
    } else {
      sendMessageToDataBase();
    }
  };

  // getting currentuser data here---------
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

  // storing message to database
  const sendMessageToDataBase = () => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const data = {
      id: Number(new Date()),
      message: message,
      time: time,
      name: currentUser[0].name,
    };
    database
      .ref("chatRoom")
      .update({ [data.id]: data })
      .then(() => {
        console.log("Message saved...");
      })
      .catch((error) => {
        console.log(error);
      });
    setMessage("");
    getChatRoom();
  };

  // getting chats  from Firebase
  useEffect(() => {
    getChatRoom();
  }, []);
  const getChatRoom = () => {
    database
      .ref("chatRoom")
      .once("value")
      .then((item) => {
        let users = [];
        item.forEach((childSnapshot) => {
          users.push(childSnapshot.val());
          setChatRoom(users);
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  // rendering messages on Screen
  const renderMessage = (item) => {
    let colors = ["red", "green", "blue", "orange", "yellow", "purple"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    return (
      <View style={styles.messageBox}>
        <Text style={[styles.msgName, { color: `${color}` }]}>
          {item.item.name}
        </Text>
        <Text style={styles.msg}>{item.item.message}</Text>
        <Text style={styles.msgTime}>{item.item.time}</Text>
      </View>
    );
  };

  // source={require("../assets/chat.jpg")}
  return (
    <View style={styles.chatContainer}>
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="red" />
      ) : (
        <ScrollView style={styles.container}>
          <FlatList data={chatRoom} renderItem={renderMessage} />
        </ScrollView>
      )}
      <View style={styles.sendMsgContainer}>
        <TextInput
          style={styles.input}
          placeholder="enter message"
          onChangeText={(text) => setMessage(text)}
          value={message}
        />
        <TouchableOpacity onPress={validation}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon style={styles.icon} icon={faPaperPlane} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "white",
    flexDirection: "column-reverse",
  },
  chatContainer: {
    width: "100%",
    height: "100%",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 40,
    backgroundColor: "white",
    paddingLeft: 8,
  },
  sendMsgContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "lightgrey",
  },
  icon: {
    width: "20px",
    height: "20px",
    color: "white",
  },
  iconContainer: {
    padding: 7,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "dodgerblue",
    cursor: "pointer",
  },
  messageBox: {
    marginBottom: 10,
    backgroundColor: "grey",
    paddingHorizontal: 10,
    paddingVertical: 3,
    minWidth: 80,
    alignSelf: "flex-start",
    borderRadius: 4,
  },
  msgName: {
    fontSize: 19,
    fontWeight: "600",
    marginBottom: 3,
  },
  msg: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  msgTime: {
    color: "lightgrey",
    alignSelf: "flex-end",
  },
});
