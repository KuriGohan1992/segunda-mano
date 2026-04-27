import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { img_placeholder } from "../constants/img_placeholder";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RatingCard({ item }: any) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState<string | null>(null);
  const [buyerImage, setBuyerImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const listingRef = doc(db, "listings", item.listingId);
        const listingSnap = await getDoc(listingRef);

        if (listingSnap.exists() && isMounted) {
          const d: any = listingSnap.data();
          setImgUrl(d.images?.[0] || d.thumbnail || null);
        }

        if (item.userId) {
          const userRef = doc(db, "users", item.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && isMounted) {
            const u = userSnap.data();
            setBuyerName(u.username || "Unknown");
            setBuyerImage(u.picture || null);
          }
        }
      } catch (err) {
        console.log("fetch error", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [item.listingId, item.userId]);

  const buyerUri =
    buyerImage && buyerImage !== ""
      ? buyerImage.startsWith("http")
        ? buyerImage
        : buyerImage.startsWith("data:image")
        ? buyerImage
        : `data:image/jpeg;base64,${buyerImage}`
      : null;

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Text key={i} style={styles.star}>
            {i <= rating ? "★" : "☆"}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        
        <View style={styles.leftHeader}>
          <Image
            source={buyerUri ? { uri: buyerUri } : img_placeholder}
            style={styles.avatar}
          />

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>
              {buyerName || "Unknown"}{" "}
              <Text style={styles.listingName}>
                ({item.listingName || "Unknown Item"})
              </Text>
            </Text>

            {renderStars(item.sellerRating)}
          </View>
        </View>

        <Text style={styles.date}>
          {item.updatedAt
            ? new Date(item.updatedAt.seconds * 1000).toLocaleDateString()
            : ""}
        </Text>
      </View>

      <Text style={styles.description}>
        {item.review}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 0,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftHeader: {
    flexDirection: "row",
    flex: 1,
    marginRight: 8,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ccc",
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  listingName: {
    fontSize: 13,
    color: "#777",
    fontWeight: "400",
  },

  date: {
    fontSize: 11,
    color: "#999",
  },

  starRow: {
    flexDirection: "row",
  },

  star: {
    fontSize: 14,
    color: "#DC143C",
    marginRight: 2,
  },

  description: {
    marginTop: 10,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
});