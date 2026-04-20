import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useState, useEffect } from "react";
import { getDocs, collection, orderBy, query, onSnapshot, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../(tabs)/styles";

export default function Chats() {
  const { user } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [latestMsgs, setLatestMsgs] = useState<any>({});
  const router = useRouter();

  const formatTime = (timestamp: any) => {
    if (!timestamp?.toDate) return "";

    const date = timestamp.toDate();
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (diffDays < 2) {
      return "Yesterday";
    }

    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());

      const myMsgs  = msgs.filter(msg =>
        msg.senderId === user.uid || msg.receiverId === user.uid
      );

      const uniqueUserIds = new Set<string>();
      const latestMap: any = {};

      myMsgs.forEach(msg => {
        const otherId = msg.senderId === user.uid ? msg.receiverId : msg.senderId;

        uniqueUserIds.add(otherId);

        if (!latestMap[otherId]) latestMap[otherId] = msg;
      });

      setUserIds(Array.from(uniqueUserIds));
      setLatestMsgs(latestMap);
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
          renderItem={({ item }) => {
            const lastMsg = latestMsgs[item.id];
            return (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <Image source={ item.picture ? { uri: item.picture } : require("../../assets/profile.png") }
              style={styles.chatAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.username}>
                  {item.username || item.email}
                </Text>
                <Text
                  style={styles.subtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {lastMsg?.text || "No messages yet"}
                </Text>
              </View>
              <Text style={styles.chatTime}>
                {formatTime(lastMsg?.createdAt)}
              </Text>
            </TouchableOpacity>
          )}}
        />
      </View>
    </SafeAreaView>
  );
}
