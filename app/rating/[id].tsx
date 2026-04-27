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
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@/context/UserContext";

export default function RatingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      review: "",
    },
  });

  const [productName, setProductName] = useState("Loading...");
  const [sellerName, setSellerName] = useState("Loading...");

  const [productRating, setProductRating] = useState(5);
  const [sellerRating, setSellerRating] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const orderRef = doc(db, "orders", id as string);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) return;

        const orderData = orderSnap.data() as any;

        const listingRef = doc(db, "listings", orderData.listingId);
        const listingSnap = await getDoc(listingRef);

        if (listingSnap.exists()) {
          setProductName(listingSnap.data()?.title || "Unknown Product");
        }

        const sellerRef = doc(db, "users", orderData.sellerId);
        const sellerSnap = await getDoc(sellerRef);

        if (sellerSnap.exists()) {
          setSellerName(sellerSnap.data()?.username || "Unknown Seller");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      const reviewText = data.review;

      const orderRef = doc(db, "orders", id as string);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) return;

      const orderData = orderSnap.data() as any;

      await addDoc(collection(db, "ratings"), {
        listingId: orderData.listingId,
        productRating,
        review: reviewText,
        sellerId: orderData.sellerId,
        sellerRating,
        userId: user?.uid,
        createdAt: serverTimestamp(),
      });

      await updateDoc(orderRef, {
        hasReviewed: true,
      });

      router.back();
    } catch (err) {
      console.log("submit error", err);
      Alert.alert("Error in submitting a review, please try again.")
    }
  };

  const renderStars = (
    rating: number,
    setRating: (value: number) => void
  ) => {
    return (
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
  };

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
          Rate the product
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.label}>Product</Text>
        <Text style={styles.name}>{productName}</Text>

        {renderStars(productRating, setProductRating)}

        <Text style={[styles.label, { marginTop: 20 }]}>Seller</Text>
        <Text style={styles.name}>{sellerName}</Text>

        {renderStars(sellerRating, setSellerRating)}

        <Text style={[styles.label, { marginTop: 20 }]}>Your Review</Text>

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
    marginTop: 4,
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