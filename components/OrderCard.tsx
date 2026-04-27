import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { img_placeholder } from "../constants/img_placeholder";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";
import { useUser } from "@/context/UserContext";

export default function OrderCard({ item, onCancel }: any) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const { user } = useUser();
  const isSeller = item.sellerId === user?.uid;
  const canCancel = item.deliveryStatus === "PLACED" && item.paymentMethod === "COD";
  const [buyerName, setBuyerName] = useState<string | null>(null);
  const isBuyer = item.userId === user?.uid;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getPartyText = () => {
    const isDone = ["DELIVERED", "COMPLETED"].includes(item.deliveryStatus);
    const isCancelled = item.deliveryStatus === "CANCELLED";

    if (isSeller) {
      return `Buyer: ${buyerName || "Unknown"}`;
      // if (isCancelled) return `Buyer: ${buyerName || "Unknown"}`;
      // return isDone
      //   ? `Sold to: ${buyerName || "Unknown"}`
      //   : `Selling to: ${buyerName || "Unknown"}`;
    } else {
      return `Seller: ${sellerName || "Unknown"}`
      // if (isCancelled) return `Seller: ${sellerName || "Unknown"}`;
      // return isDone
      //   ? `Bought from: ${sellerName || "Unknown"}`
      //   : `Buying from: ${sellerName || "Unknown"}`;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", item.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && isMounted) {
          const d: any = docSnap.data();
          setImgUrl(d.images?.[0] || d.thumbnail || null);
          setCondition(d.condition || null);
        }

        if (item.userId) {
          const bRef = doc(db, "users", item.userId);
          const bSnap = await getDoc(bRef);
          if (bSnap.exists() && isMounted) {
            setBuyerName(bSnap.data()?.username || null);
          }
      }

        if (item.sellerId) {
          const sRef = doc(db, "users", item.sellerId);
          const sSnap = await getDoc(sRef);

          if (sSnap.exists() && isMounted) {
            setSellerName(sSnap.data()?.username || null);
          }
        }
      } catch (err) {
        console.log("fetch error", err);
      }
    };

    fetchListing();

    return () => {
      isMounted = false;
    };
  }, [item.listingId, item.sellerId]);

  const imageUri = imgUrl
    ? imgUrl.startsWith("http")
      ? imgUrl
      : `data:image/jpeg;base64,${imgUrl}`
    : img_placeholder;

  const handleComplete = async () => {
    try {
      const orderRef = doc(db, "orders", item.id);

      await updateDoc(orderRef, {
        deliveryStatus: "COMPLETED",
        isCompleted: true,
        hasReviewed : false,
      });

      Alert.alert("Success", "Order marked as completed.");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to complete order.");
    }
  };

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/order/${item.id}`)}
    >
      <View style={styles.row}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        <View style={styles.meta}>
          {/* TITLE */}
          <Text numberOfLines={1} style={styles.title}>
            {item.listingName}
          </Text>

          


          {/* CONDITION */}
          <Text style={styles.condition}>
            {condition || "No condition"}
          </Text>

          {/* PAYMENT + DATE */}
          <Text style={styles.sub}>
            {item.paymentMethod === "COD"
              ? "Cash on Delivery"
              : "Online Payment"}{" "}
            • {formatDate(item.createdAt)}
          </Text>
          <Text style={styles.party}>{getPartyText()}</Text>
          {/* BIG PRICE (BOTTOM RIGHT) */}
          <View style={styles.priceContainer}>
            <Text style={styles.bigPrice}>
              ₱ {Number(item.amount || 0).toLocaleString()}
            </Text>
          </View>
          
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.status}>{item.deliveryStatus}</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          
          {/* CANCEL BUTTON */}
          {canCancel && (
            <TouchableOpacity style={styles.cBtn} onPress={onCancel}>
              <Text style={styles.cText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {/* COMPLETE BUTTON */}
          {item.deliveryStatus === "DELIVERED" && (
            <TouchableOpacity
              style={styles.cBtn}
              onPress={handleComplete}
            >
              <Text style={styles.cText}>Complete Order</Text>
            </TouchableOpacity>
          )}

          {/* ADD REVIEW */}
          {isBuyer &&
            item.deliveryStatus === "COMPLETED" &&
            item.hasReviewed === false && (
              <TouchableOpacity
                style={styles.cBtn}
                onPress={() => router.push(`/rating/${item.id}`)}
              >
                <Text style={styles.cText}>Add Review</Text>
              </TouchableOpacity>
            )}

          {/* EDIT REVIEW */}
          {isBuyer &&
            item.deliveryStatus === "COMPLETED" &&
            item.hasReviewed === true && (
              <TouchableOpacity
                style={styles.cBtn}
                onPress={() => router.push(`/rating/${item.id}`)}
              >
                <Text style={styles.cText}>Edit Review</Text>
              </TouchableOpacity>
            )}

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


  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC143C",
  }, 
  sub: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },

  location: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontWeight: "700",
    color: "#dc143c",
  },

  cancel: {
    color: "#DC143C",
    fontWeight: "600",
  },

  rowInline: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
},

  separator: {
  marginHorizontal: 6,
  color: "#999",
  fontSize: 12,
  },

  priceContainer: {
    marginTop: "auto", // pushes price to bottom
    alignItems: "flex-end",
  },

  bigPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#DC143C",
  },

  condition: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },

  cBtn: {
    backgroundColor: "#dc143c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },

  cText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  party: {
    marginTop: 4,
    fontSize: 12,
    color: "#444",
    fontWeight: "600",
  },
});