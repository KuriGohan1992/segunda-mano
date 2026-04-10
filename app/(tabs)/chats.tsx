import { ScrollView, View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { getDocs, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";

export default function Chats() {
  const { user } = useUser();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const otherUserId = selectedUser;

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

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const sendMessage = async () => {
    if (!user || !text.trim() || !selectedUser) return;

    try {
      await addDoc(collection(db, "messages"), {
        text,
        senderId: user.uid,
        receiverId: selectedUser,
        createdAt: serverTimestamp(),
      });

      setText("");
      console.log("Message sent!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Chat</Text>

      {users.map((u) => {
        if (u.id === user?.uid) return null;

        return (
          <Text
            key={u.id}
            onPress={() => setSelectedUser(u.id)}
            style={{
              padding: 10,
              backgroundColor: selectedUser === u.id ? "#ddd" : "#fff",
            }}
          >
            {u.username || u.email}
          </Text>
        );
      })}
      <ScrollView style={{ flex: 1 }}>
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
        <TextInput
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
      </ScrollView>

      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
