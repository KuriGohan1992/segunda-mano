import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../(tabs)/styles";
import { Listing } from "../../type/listing";
import { img_placeholder } from "../../constants/img_placeholder";
import ListingCard from "../../components/ListingCard";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SellerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [picture, setPicture] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("listings");
  const [userListings, setUserListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function getSellerDetails() {
      setLoading(true);

      if (!id) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const d: any = docSnap.data();
        setUsername(d.username);
        setAddress(d.address);
        if (d.picture) {
          setPicture(d.picture);
        }
      }

      setLoading(false);
    }

    getSellerDetails();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "listings"),
      where("sellerId", "==", id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const listings = snapshot.docs.map((doc) => {
        const d = doc.data() as any;

        return {
          id: doc.id,
          available: d.available ?? true,
          category: d.category || "",
          condition: d.condition || "",
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

      setUserListings(listings);
    });

    return () => unsub();
  }, [id]);

  const getImageSource = () => {
    if (!picture) {
      return require("../../assets/profile.png");
    }

    if (picture.startsWith("data:image")) {
      return { uri: picture };
    }

    if (!picture.startsWith("http")) {
      return { uri: `data:image/jpeg;base64,${picture}` };
    }

    return { uri: picture };
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#E6173B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 40,
          left: 15,
          zIndex: 10,
        }}
      >
        <Ionicons name="close" size={28} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.profileHeader} />
      
      <View style={styles.cover} />

      <View style={styles.profileSection}>
        <View>
          <Image style={styles.avatar} source={getImageSource()} />
        </View>

        <Text style={styles.usernameText}>@{username}</Text>
        <Text style={styles.ratingText}>No ratings yet.</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {["listings", "reviews", "about"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabLine} />

        <View
          style={[
            styles.tabIndicator,
            {
              transform: [
                {
                  translateX:
                    activeTab === "listings"
                      ? 0
                      : activeTab === "reviews"
                      ? styles.tabIndicator.width
                      : styles.tabIndicator.width * 2,
                },
              ],
            },
          ]}
        />
      </View>

      {activeTab === "listings" ? (
        <FlatList
          data={userListings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 8,
            paddingBottom: 80,
          }}
          columnWrapperStyle={{
            justifyContent: "flex-start",
          }}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text>No products available</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                maxWidth: "50%",
                paddingHorizontal: 4,
                marginBottom: 12,
              }}
            >
              <ListingCard
                item={item}
                onPress={() => router.push(`/listing/${item.id}`)}
              />
            </View>
          )}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === "reviews" && (
            <View style={styles.centerContent}>
              <Text>No ratings yet</Text>
            </View>
          )}

          {activeTab === "about" && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Personal Information
                </Text>
              </View>

              <Text style={styles.label}>Name</Text>
              <Text>{username}</Text>

              <Text style={styles.label}>Gender</Text>
              <Text>Not Specified</Text>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                  Contact Information
                </Text>
              </View>

              <Text style={styles.label}>Address</Text>
              <Text>{address}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}