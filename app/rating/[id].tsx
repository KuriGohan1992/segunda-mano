import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import CustomInput from "@/components/CustomInput";
import { useForm } from "react-hook-form";

export default function RatingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [productName, setProductName] = useState("Loading...");
  const [sellerName, setSellerName] = useState("Loading...");

  const [productRating, setProductRating] = useState(5);
  const [sellerRating, setSellerRating] = useState(5);
  

  const { control, handleSubmit: formSubmit } = useForm();

  useEffect(() => {
    const fetchData = async () => {
        try {
        if (!id) return;

        //Get ORDER
        const orderRef = doc(db, "orders", id as string);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            console.log("Order not found");
            return;
        }

        const orderData = orderSnap.data() as any;

        //Get LISTING (product)
        if (orderData.listingId) {
            const listingRef = doc(db, "listings", orderData.listingId);
            const listingSnap = await getDoc(listingRef);

            if (listingSnap.exists()) {
            const listingData = listingSnap.data() as any;
            setProductName(listingData.title || "Unnamed Product");
            }
        }

        //Get SELLER
        if (orderData.sellerId) {
            const sellerRef = doc(db, "users", orderData.sellerId);
            const sellerSnap = await getDoc(sellerRef);

            if (sellerSnap.exists()) {
            const sellerData = sellerSnap.data() as any;
            setSellerName(sellerData.username || "Unknown Seller");
            }
        }

        } catch (err) {
        console.log("Fetch error:", err);
        }
    };

    fetchData();
    }, [id]);

  const handleProductStar = (i: number) => {
    setProductRating((prev) => (prev === i ? 0 : i));
  };

  const handleSellerStar = (i: number) => {
    setSellerRating((prev) => (prev === i ? 0 : i));
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

  const handleSubmit = async (data: any) => {
    try {
      console.log({
        productRating,
        sellerRating,
        reviewText: data.review,
      });

      // 🔽 Firebase logic later

    } catch (err) {
      console.log("submit error", err);
    }
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

        {renderStars(productRating, handleProductStar)}

        <Text style={[styles.label, { marginTop: 20 }]}>Seller</Text>
        <Text style={styles.name}>{sellerName}</Text>

        {renderStars(sellerRating, handleSellerStar)}

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
          onPress={formSubmit(handleSubmit)}
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