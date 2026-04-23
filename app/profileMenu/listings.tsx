import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { Listing } from "../../type/listing";
import ListingCard from "../../components/ListingCard";
import styles from "../(tabs)/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { img_placeholder } from "../../constants/img_placeholder";

export default function ListingsManager() {
  const router = useRouter();
  const { user } = useUser();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "listings"),
      where("sellerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data() as any;

        return {
          id: doc.id,
          available: d.available ?? true,
          category: d.category || "",
          condition: d.condition || "",
          type: d.type || "sell",
          createdAt: d.createdAt || new Date().toISOString(),
          description: d.description || "",
          images: Array.isArray(d.images) ? d.images : [],
          thumbnail: Array.isArray(d.images)
            ? d.images[0]
            : img_placeholder,
          location: d.location || "",
          price: d.price ?? 0,
          sellerId: d.sellerId || "",
          title: d.title || "",
        } as Listing;
      });

      setListings(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#DC143C" />
        </TouchableOpacity>

        <Text style={styles.title}>Your Products</Text>

        <View style={{ width: 28 }} />
        </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.listRowLeft}
        contentContainerStyle={styles.listContentWithTop}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text>No listings posted</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.listItemWrapper}>
            <ListingCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/profileMenu/editListing",
                  params: { id: item.id },
                })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}