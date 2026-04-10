import { StyleSheet, Keyboard, ScrollView, View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useRef } from "react";
import { getDocs, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function ChatScreen() {
  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { user } = useUser();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const otherUserId = id as string;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const filteredMsgs = msgs.filter(msg =>
        (msg.senderId === user?.uid && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === user?.uid)
      );

      setMessages(filteredMsgs);
    });

    return () => unsubscribe();
  }, [user, otherUserId]);


  const sendMessage = async () => {
    if (!user || !text.trim() || !otherUserId) return;

    try {
      await addDoc(collection(db, "messages"), {
        text,
        senderId: user.uid,
        receiverId: otherUserId,
        createdAt: serverTimestamp(),
      });

      setText("");
      console.log("Message sent!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingBottom: keyboardHeight-34}}>

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
                <Text style={isMe ? styles.messageTextMe : styles.messageTextOther}>
                  {msg.text}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            onFocus={() => 
              scrollRef.current?.scrollToEnd({ animated: false })
            }
            placeholder="Type message..."
            style={styles.input}
            onSubmitEditing={sendMessage}
          />

          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <MaterialIcons name="send" size={20} color="#dc143c" />
          </TouchableOpacity>
        </View>

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
});
