import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function RatingCard({ item }: any) {
  const [otherUser, setOtherUser] = useState<any>(null);

  const isSeller = item.role === "seller";

  const rating = isSeller
    ? item.sellerRating
    : item.buyerRating;

  const review = isSeller
    ? item.sellerRemarks
    : item.buyerRemarks;

  const otherUserId = isSeller
    ? item.buyerId
    : item.sellerId;

  // fetch other user
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        if (!otherUserId) return;

        const ref = doc(db, "users", otherUserId);
        const snap = await getDoc(ref);

        if (snap.exists() && mounted) {
          setOtherUser(snap.data());
        }
      } catch (e) {
        console.log("fetch user error:", e);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [otherUserId]);

  // image handling (same logic that worked before)
  const imageUri =
    otherUser?.picture && otherUser.picture !== ""
      ? otherUser.picture.startsWith("http")
        ? otherUser.picture
        : otherUser.picture.startsWith("data:image")
        ? otherUser.picture
        : `data:image/jpeg;base64,${otherUser.picture}`
      : null;

  const renderStars = (value = 0) => (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ color: i <= value ? "#DC143C" : "#ccc" }}>
          ★
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={imageUri ? { uri: imageUri } : undefined}
          style={styles.avatar}
        />

        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>
            {otherUser?.username || "Unknown"}
          </Text>

          {renderStars(rating)}
        </View>
      </View>

      <Text style={styles.review}>
        {review || "No review provided"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ccc",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
  },
  review: {
    marginTop: 8,
    fontSize: 13,
    color: "#555",
  },
});