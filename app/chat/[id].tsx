import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useRef, useEffect } from "react";
import { getDoc, doc, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ChatScreen() {
  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { user } = useUser();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const otherUserId = id as string;

  const [otherUser, setOtherUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!otherUserId) return;

      const userRef = doc(db, "users", otherUserId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setOtherUser({ id: userSnap.id, ...userSnap.data() });
      }
    };

    fetchUser();
  }, [otherUserId]);

  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
  //     setKeyboardHeight(e.endCoordinates.height);
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     setKeyboardHeight(0);
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({animated: true});
    }, 0);
  }, [messages]);

  useEffect(() => {
    if (!user || !otherUserId) return;

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filteredMsgs = msgs.filter(msg =>
        (msg.senderId === user?.uid && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === user?.uid)
      );

      setMessages(filteredMsgs);

      const unseenMsgs = filteredMsgs.filter(msg =>
        msg.receiverId === user?.uid &&
        msg.senderId === otherUserId &&
        !msg.seen
      );

      const updates = unseenMsgs.map(msg =>
        updateDoc(doc(db, "messages", msg.id), {
          seen: true,
        })
      );

      await Promise.all(updates);
    });

    return () => unsubscribe();
  }, [user, otherUserId]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;

      await addDoc(collection(db, "messages"), {
        image: base64,
        senderId: user?.uid,
        receiverId: otherUserId,
        createdAt: serverTimestamp(),
        seen: false,
      });
    }
  };

  const sendMessage = async () => {
    if (!user || !text.trim() || !otherUserId) return;

    try {
      await addDoc(collection(db, "messages"), {
        text,
        senderId: user.uid,
        receiverId: otherUserId,
        createdAt: serverTimestamp(),
        seen: false,
      });

      setText("");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>

          <Image
            source={
              otherUser?.picture
                ? { uri: otherUser.picture }
                : require("../../assets/profile.png")
            }
            style={styles.headerAvatar}
          />

          <Text style={styles.headerName}>
            {otherUser?.username || "User"}
          </Text>

          {/* You can add more header actions here (e.g., call button, menu, etc.) */}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 12 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  isMe ? styles.myMessage : styles.otherMessage,
                ]}
              >
                {msg.image && typeof msg.image === "string" ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${msg.image}` }}
                    style={styles.chatImage}
                  />
                ) : msg.text ? (
                  <Text style={isMe ? styles.messageTextMe : styles.messageTextOther}>
                    {msg.text}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={50}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={pickImage} style={{ marginRight: 8 }}>
              <MaterialIcons name="add" size={26} color="#DC143C" />
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder="Type message..."
              style={styles.input}
              onSubmitEditing={sendMessage}
            />

            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <MaterialIcons name="send" size={20} color="#dc143c" />
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  innerContainer: {
    flex: 1,
    padding: 16,
  },

  messagesContainer: {
    flex: 1,
  },

  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "70%",

    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dc143c",
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },

  messageTextMe: {
    color: "#fff",
    fontSize: 14,
  },

  messageTextOther: {
    color: "#333",
    fontSize: 14,
  },

  chatImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 4,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  input: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8,
    fontSize: 14,
  },

  sendButton: {
    // paddingVertical: 10,
    // paddingHorizontal: 14,

    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  sendText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#eee",
  },

  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  arrow: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
});