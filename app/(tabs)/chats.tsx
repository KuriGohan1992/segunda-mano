import { ScrollView, View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { getDocs, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";
import { useRouter } from 'expo-router';

export default function Chats() {
  const { user } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Chat</Text>

      {users.map((u) => {
        if (u.id === user?.uid) return null;

        return (
          <Text
            key={u.id}
            onPress={() => router.push(`/chat/${u.id}`)}
            style={{
              padding: 10,
              backgroundColor: selectedUser === u.id ? "#ddd" : "#fff",
            }}
          >
            {u.username || u.email}
          </Text>
        );
      })}
    </View>
  );
}
