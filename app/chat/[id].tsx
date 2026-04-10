import { Keyboard, ScrollView, View, Text, TextInput, Button } from "react-native";
import { useState, useRef } from "react";
import { getDocs, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
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
      inputRef.current?.focus();
      console.log("Message sent!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

return (
    <View style={{ flex: 1, padding: 20, paddingBottom: keyboardHeight }}>
      <ScrollView 
        style={{ flex: 1 }}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          scrollRef.current?.scrollToEnd({ animated: false });
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;

          return (
            <View
              key={msg.id}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#DCF8C6" : "#E5E5EA",
                padding: 10,
                borderRadius: 10,
                marginVertical: 5,
                maxWidth: "70%",
              }}
            >
              <Text>{msg.text}</Text>
            </View>
          );
        })}
      </ScrollView>

      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        placeholder="Type message..."
        onSubmitEditing={sendMessage}
        style={{
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
        }}
      />

      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
