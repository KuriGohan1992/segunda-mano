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
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../(tabs)/styles";
import { Listing } from "../../type/listing";
import { img_placeholder } from "../../constants/img_placeholder";
import ListingCard from "../../components/ListingCard";
import RatingCard from "../../components/RatingsCard"; // ✅ ONLY ADDITION
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "../../context/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellerProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const uid = user?.uid;

  const [loading, setLoading] = useState(true);

  const [picture, setPicture] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  const [activeTab, setActiveTab] = useState("listings");
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sellerAvgRating, setSellerAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);

  const tabs = ["listings", "reviews"];
  const activeIndex = tabs.indexOf(activeTab);

  // -------------------------
  // SELLER INFO
  // -------------------------
  useEffect(() => {
    async function getSellerDetails() {
      setLoading(true);

      if (!id) return setLoading(false);

      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const d: any = docSnap.data();

        setUsername(d.username || "");
        setAddress(d.address || "");
        setPicture(d.picture || "");

        if (d.createdAt?.toDate) {
          const date = d.createdAt.toDate();
          setJoinedDate(
            date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        }
      }

      setLoading(false);
    }

    getSellerDetails();
  }, [id]);

  // -------------------------
  // LISTINGS
  // -------------------------
  useEffect(() => {
    if (!id) return;

    const q = query(collection(db, "listings"), where("sellerId", "==", id));

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
          type: d.type,
        } as Listing;
      });

      setUserListings(listings);
    });

    return () => unsub();
  }, [id]);

  // -------------------------
  // REVIEWS (SELLER ONLY)
  // -------------------------
  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "ratings"),
      where("sellerId", "==", id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const valid = data.filter((r: any) => r.sellerRating != null);

      const total = valid.reduce(
        (sum, r: any) => sum + (r.sellerRating || 0),
        0
      );

      setReviews(valid);
      setRatingCount(valid.length);
      setSellerAvgRating(valid.length ? total / valid.length : null);
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
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color="#DC143C"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.title, { marginBottom: 0 }]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingTop: 10 }}>
        <Image style={styles.avatar} source={getImageSource()} />

        <View style={{ marginLeft: 12, justifyContent: "center" }}>
          <Text style={styles.usernameText}>{username}</Text>
          <Text style={styles.infoText}>{address}</Text>
          <Text style={styles.infoText}>Joined {joinedDate}</Text>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
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
              width: `${100 / tabs.length}%`,
              left: `${(activeIndex * 100) / tabs.length}%`,
            },
          ]}
        />
      </View>

      {/* CONTENT */}
      {activeTab === "listings" ? (
        <FlatList
          data={userListings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={{
              flex: 1,
              maxWidth: "50%",
              paddingHorizontal: 4,
              marginBottom: 12,
            }}>
              <ListingCard
                item={item}
                onPress={() => router.push(`/listing/${item.id}`)}
              />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={reviews}
          key="reviews"
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text>No ratings yet</Text>
            </View>
          }
          renderItem={({ item }) => (
            <RatingCard item={item} />
          )}
        />
      )}

      {/* CHAT BUTTON */}
      {uid !== id && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push(`/chat/${id}`)}
        >
          <Ionicons name="chatbubble" size={26} color="#fff" />
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
}