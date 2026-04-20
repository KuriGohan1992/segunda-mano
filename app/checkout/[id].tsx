import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../../firebase";
import * as Linking from "expo-linking";
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function Checkout() {
  const { id } = useLocalSearchParams();
  const [listing, setListing] = useState<any>(null);
  const checkout = httpsCallable(functions, "createCheckout");

  const handlePay = async () => {
    const res = await checkout({
      amount: listing.price*100,
      description: listing.title,
    });
    Linking.openURL(res.data);

  };

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      const ref = doc(db, "listings", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setListing({
          id: snap.id,
          ...snap.data()
        })
      } else {
        console.log("Listing not found");
      }
    };

    fetchListing();
  }, [id]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Checkout for item: {listing.title}</Text>

      <TouchableOpacity
        onPress={handlePay}
        style={{
          marginTop: 20,
          backgroundColor: "#DC143C",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff" }}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}