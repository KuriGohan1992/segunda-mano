import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useRef, useEffect } from "react";
import {
  getDoc,
  doc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
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

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 0);
  }, [messages]);

  useEffect(() => {
    if (!user || !otherUserId) return;

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredMsgs = msgs.filter(
        (msg) =>
          (msg.senderId === user?.uid && msg.receiverId === otherUserId) ||
          (msg.senderId === otherUserId && msg.receiverId === user?.uid)
      );

      setMessages(filteredMsgs);

      const unseenMsgs = filteredMsgs.filter(
        (msg) =>
          msg.receiverId === user?.uid &&
          msg.senderId === otherUserId &&
          !msg.seen
      );

      const updates = unseenMsgs.map((msg) =>
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

    await addDoc(collection(db, "messages"), {
      text,
      senderId: user.uid,
      receiverId: otherUserId,
      createdAt: serverTimestamp(),
      seen: false,
    });

    setText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
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
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 12 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.uid;

            if (msg.image) {
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.imageBubble,
                    isMe ? styles.imageRight : styles.imageLeft,
                  ]}
                >
                  <Image
                    source={{
                      uri: `data:image/jpeg;base64,${msg.image}`,
                    }}
                    style={styles.chatImage}
                  />
                </View>
              );
            }

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  isMe ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text
                  style={
                    isMe
                      ? styles.messageTextMe
                      : styles.messageTextOther
                  }
                >
                  {msg.text}
                </Text>
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

            <TouchableOpacity onPress={sendMessage}>
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

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  backButton: {
    marginRight: 8,
    padding: 4,
  },

  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "70%",
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
  },

  messageTextOther: {
    color: "#333",
  },

  imageBubble: {
    marginVertical: 4,
    maxWidth: "70%",
    borderRadius: 12,
    overflow: "hidden",
  },

  imageRight: {
    alignSelf: "flex-end",
  },

  imageLeft: {
    alignSelf: "flex-start",
  },

  chatImage: {
    width: 220,
    height: 220,
    borderRadius: 12,
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
  },
});