import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useState, useEffect } from "react";
import { getDocs, collection, orderBy, query, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../(tabs)/styles";

export default function Chats() {
  const { user } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());

      const myMsgs  = msgs.filter(msg =>
        msg.senderId === user.uid || msg.receiverId === user.uid
      );

      const uniqueUserIds = new Set<string>();

      myMsgs.forEach(msg => {
        if (msg.senderId !== user.uid) {
          uniqueUserIds.add(msg.senderId);
        }

        if (msg.receiverId !== user.uid) {
          uniqueUserIds.add(msg.receiverId);
        }
      });

      setUserIds(Array.from(uniqueUserIds));
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await Promise.all(
        userIds.map(async (id) => {
          const ref = doc(db, "users", id);
          const snap = await getDoc(ref);
          
          if (snap.exists()) {
            return {id, ...snap.data()}
          }

          return null;

        })
      );

      setUsers(usersData.filter(Boolean));
    };

    if (userIds.length) fetchUsers();
  }, [userIds]);

  console.log(userIds)

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
