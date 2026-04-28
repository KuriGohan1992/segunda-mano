import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@/context/UserContext";

export default function RatingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      review: "",
    },
  });

  const [orderData, setOrderData] = useState<any>(null);
  const [productName, setProductName] = useState("Loading...");
  const [buyerName, setBuyerName] = useState("Loading...");
  const [sellerName, setSellerName] = useState("Loading...");
  const [rating, setRating] = useState(5);

  const isBuyer = user?.uid === orderData?.userId;
  const isSeller = user?.uid === orderData?.sellerId;

  const targetLabel = isBuyer ? "Seller" : "Buyer";
  const targetName = isBuyer ? sellerName : buyerName;

  const ratingField = isBuyer ? "sellerRating" : "buyerRating";
  const remarksField = isBuyer ? "sellerRemarks" : "buyerRemarks";
  const updatedField = isBuyer ? "sellerUpdatedAt" : "buyerUpdatedAt";

  const ratingId = orderData
    ? `${orderData.listingId}_${orderData.userId}`
    : null;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const orderRef = doc(db, "orders", id as string);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) return;

      const data = orderSnap.data();
      setOrderData(data);

      // listing
      const listingSnap = await getDoc(
        doc(db, "listings", data.listingId)
      );

      if (listingSnap.exists()) {
        setProductName(listingSnap.data()?.title || "Unknown Product");
      }

      // buyer
      const buyerSnap = await getDoc(doc(db, "users", data.userId));
      if (buyerSnap.exists()) {
        setBuyerName(buyerSnap.data()?.username || "Unknown Buyer");
      }

      // seller
      const sellerSnap = await getDoc(doc(db, "users", data.sellerId));
      if (sellerSnap.exists()) {
        setSellerName(sellerSnap.data()?.username || "Unknown Seller");
      }
    };

    fetchData();
  }, [id]);

  // ⭐ NEW: load existing rating (EDIT MODE)
  useEffect(() => {
    const loadExisting = async () => {
      if (!orderData || !user?.uid) return;

      const ratingId = `${orderData.listingId}_${orderData.userId}`;
      const ratingRef = doc(db, "ratings", ratingId);

      const snap = await getDoc(ratingRef);

      if (!snap.exists()) return;

      const data = snap.data();

      // BUYER editing seller rating
      if (user.uid === orderData.userId) {
        setRating(data.sellerRating ?? 5);
        setValue("review", data.sellerRemarks ?? "");
      }

      // SELLER editing buyer rating
      if (user.uid === orderData.sellerId) {
        setRating(data.buyerRating ?? 5);
        setValue("review", data.buyerRemarks ?? "");
      }
    };

    loadExisting();
  }, [orderData, user]);

  const onSubmit = async (data: any) => {
    try {
      if (!orderData || !ratingId) return;

      const ratingRef = doc(db, "ratings", ratingId);

      await setDoc(
        ratingRef,
        {
          listingId: orderData.listingId,
          listingName: productName,

          sellerId: orderData.sellerId,
          buyerId: orderData.userId,

          [ratingField]: rating,
          [remarksField]: data.review,
          [updatedField]: serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(doc(db, "orders", id as string), {
        hasReviewed: true,
      });

      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to submit review.");
    }
  };

  const renderStars = () => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={28}
            color="#DC143C"
            style={{ marginRight: 6 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#DC143C" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isBuyer ? "Rate the Seller" : "Rate the Buyer"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.label}>Product</Text>
        <Text style={styles.name}>{productName}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>
          {targetLabel}
        </Text>
        <Text style={styles.name}>{targetName}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>
          Your Rating
        </Text>

        {renderStars()}

        <Text style={[styles.label, { marginTop: 20 }]}>
          Your Review
        </Text>

        <CustomInput
          name="review"
          placeholder="Write your review..."
          multiline
          control={control}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  backButton: {
    position: "absolute",
    left: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DC143C",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  label: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },

  starRow: {
    flexDirection: "row",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#DC143C",
    paddingVertical: 14,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});