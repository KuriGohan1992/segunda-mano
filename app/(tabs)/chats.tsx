import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  getDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../(tabs)/styles";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  const deleteConversation = async (otherUserId: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const q = query(collection(db, "messages"));
            const snap = await getDocs(q);

            const deletions = snap.docs.map((d) => {
              const msg = d.data();

              const isBetweenUsers =
                (msg.senderId === user?.uid && msg.receiverId === otherUserId) ||
                (msg.senderId === otherUserId && msg.receiverId === user?.uid);

              if (isBetweenUsers) {
                return deleteDoc(doc(db, "messages", d.id));
              }

              return null;
            });

            await Promise.all(deletions);
          },
        },
      ]
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>
      {userIds.length ? (
        <View style={styles.feed}>
          <FlatList
            data={users.filter(u => u.id !== user?.uid)}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const lastMsg = latestMsgs[item.id];

              const isUnread =
                lastMsg &&
                lastMsg.receiverId === user?.uid &&
                !lastMsg.seen;

              return (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => router.push(`/chat/${item.id}`)}
                >
                  <Image
                    source={
                      item.picture
                        ? { uri: item.picture }
                        : require("../../assets/profile.png")
                    }
                    style={styles.chatAvatar}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.username,
                        isUnread && { fontWeight: "700" },
                      ]}
                    >
                      {item.username || item.email}
                    </Text>

                    <Text
                      style={[
                        styles.subtitle,
                        isUnread && {
                          color: "#111",
                          fontWeight: "600",
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {lastMsg?.image
                        ? (lastMsg.senderId === user?.uid
                            ? "You sent an image"
                            : `${item.username || "User"} sent an image`)
                        : lastMsg?.text || "No messages yet"}
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
                    <Text
                      style={[
                        styles.chatTime,
                        isUnread && {
                          color: "#DC143C",
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {formatTime(lastMsg?.createdAt)}
                    </Text>

                    <TouchableOpacity
                      onPress={() => deleteConversation(item.id)}
                      style={{ marginTop: 6 }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#999" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/empty-chat.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />

          <Text style={styles.emptyTitle}>
            No chats yet
          </Text>

          <Text style={styles.emptySubtitle}>
            Start a conversation by messaging a seller
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.emptyButtonText}>
              Browse Listings
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
