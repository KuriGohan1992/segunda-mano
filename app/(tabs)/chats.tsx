import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../(tabs)/styles";

export default function Chats() {
  const { user } = useUser();
  const [users, setUsers] = useState<any[]>([]);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <View style={styles.feed}>
        <FlatList
          data={users.filter(u => u.id !== user?.uid)}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <Image source={ item.picture ? { uri: item.picture } : require("../../assets/profile.png") }
              style={styles.chatAvatar}
              />
              <View>
                <Text style={styles.username}>
                  {item.username || item.email}
                </Text>
                <Text style={styles.subtitle}>
                  Latest message placeholder
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
