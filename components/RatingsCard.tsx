import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
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
        // 🔹 Listing (for image + name fallback if needed)
        const listingRef = doc(db, "listings", item.listingId);
        const listingSnap = await getDoc(listingRef);

        if (listingSnap.exists() && isMounted) {
          const d: any = listingSnap.data();
          setImgUrl(d.images?.[0] || d.thumbnail || null);
        }

        // 🔹 Buyer (review author)
        if (item.userId) {
          const userRef = doc(db, "users", item.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && isMounted) {
            const u = userSnap.data();
            setBuyerName(u.username || "Unknown");
            setBuyerImage(u.profilePic || null);
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

  const imageUri = imgUrl
    ? imgUrl.startsWith("http")
      ? imgUrl
      : `data:image/jpeg;base64,${imgUrl}`
    : img_placeholder;

  const buyerUri = buyerImage
    ? buyerImage.startsWith("http")
      ? buyerImage
      : `data:image/jpeg;base64,${buyerImage}`
    : img_placeholder;

  // ⭐ Render stars (READ ONLY)
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
    <Pressable style={styles.card}>
      <View style={styles.row}>
        
        {/* PRODUCT IMAGE */}
        <Image source={{ uri: imageUri }} style={styles.image} />

        <View style={styles.meta}>
          
          {/* PRODUCT NAME */}
          <Text numberOfLines={1} style={styles.title}>
            {item.listingName}
          </Text>

          {/* BROUGHT BY */}
          <View style={styles.buyerRow}>
            <Image source={{ uri: buyerUri }} style={styles.avatar} />
            <Text style={styles.party}>
              Brought by {buyerName || "Unknown"}
            </Text>
          </View>

          {/* STARS */}
          {renderStars(item.productRating)}

          {/* REVIEW TEXT */}
          <Text numberOfLines={2} style={styles.review}>
            {item.review}
          </Text>

        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    height: 120,
  },

  image: {
    width: 120,
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#eee",
  },

  meta: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  buyerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: "#ccc",
  },

  party: {
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
  },

  starRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  star: {
    fontSize: 14,
    color: "#DC143C",
    marginRight: 2,
  },

  review: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
});