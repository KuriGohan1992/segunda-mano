import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../context/UserContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./styles";
import { Listing } from "../../type/listing";
import { img_placeholder } from "../../constants/img_placeholder";
import ListingCard from "../../components/ListingCard";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCard from "@/components/OrderCard";
import RatingCard from "@/components/RatingsCard";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const uid = user?.uid;
  const email = user?.email;
  const [picture, setPicture] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [joinedDate, setJoinedDate] = useState("Not Available");
  const [orders, setOrders] = useState<any[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sellerAvgRating, setSellerAvgRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);

  const tabs = ["listings", "reviews", "my Orders"];
  const activeIndex = tabs.indexOf(activeTab);

  const { tab } = useLocalSearchParams();

  useEffect(() => {
    if (!uid) return;

    let sellerRatings: any[] = [];
    let buyerRatings: any[] = [];

    const sellerQuery = query(
      collection(db, "ratings"),
      where("sellerId", "==", uid)
    );

    const buyerQuery = query(
      collection(db, "ratings"),
      where("buyerId", "==", uid)
    );

    const merge = () => {
      const combined = [...sellerRatings, ...buyerRatings];

      const unique = Array.from(
        new Map(combined.map((r) => [r.id, r])).values()
      );

      const valid = unique.filter((r: any) => {
        if (r.sellerId === uid) return r.sellerRating != null;
        if (r.buyerId === uid) return r.buyerRating != null;
        return false;
      });

      const total = valid.reduce((sum, r: any) => {
        if (r.sellerId === uid) return sum + (r.sellerRating || 0);
        if (r.buyerId === uid) return sum + (r.buyerRating || 0);
        return sum;
      }, 0);

      setSellerAvgRating(valid.length ? total / valid.length : null);
      setRatingCount(valid.length);
      setReviews(valid);
    };

    const unsubSeller = onSnapshot(sellerQuery, (snapshot) => {
      sellerRatings = snapshot.docs.map((doc) => ({
        id: doc.id,
        role: "seller",
        ...doc.data(),
      }));
      merge();
    });

    const unsubBuyer = onSnapshot(buyerQuery, (snapshot) => {
      buyerRatings = snapshot.docs.map((doc) => ({
        id: doc.id,
        role: "buyer",
        ...doc.data(),
      }));
      merge();
    });

    return () => {
      unsubSeller();
      unsubBuyer();
    };
  }, [uid]);

  // ⭐ FIXED star renderer
  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Text
            key={i}
            style={{
              color: i <= Math.round(rating) ? "#DC143C" : "#ccc",
              fontSize: 16,
            }}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  useEffect(() => {
    if (tab) {
      setActiveTab(tab as string);
    }
  }, [tab]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", uid), (docSnap) => {
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
    });

    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "listings"),
      where("sellerId", "==", uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const listings = snapshot.docs.map((doc) => {
        const d = doc.data() as any;

        return {
          id: doc.id,
          available: d.available ?? true,
          category: d.category || "",
          condition: d.condition || "",
          type: d.type,
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
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    let buyerOrders: any[] = [];
    let sellerOrders: any[] = [];

    const buyerQuery = query(
      collection(db, "orders"),
      where("userId", "==", uid)
    );

    const sellerQuery = query(
      collection(db, "orders"),
      where("sellerId", "==", uid)
    );

    const mergeAndSet = () => {
      const merged = [...buyerOrders, ...sellerOrders];

      const unique = Array.from(
        new Map(merged.map((o) => [o.id, o])).values()
      );

      unique.sort((a: any, b: any) => {
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });

      setOrders(unique);
    };

    const unsubBuyer = onSnapshot(buyerQuery, (snapshot) => {
      buyerOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      mergeAndSet();
    });

    const unsubSeller = onSnapshot(sellerQuery, (snapshot) => {
      sellerOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      mergeAndSet();
    });

    return () => {
      unsubBuyer();
      unsubSeller();
    };
  }, [uid]);

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

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => router.replace("../(auth)"),
        },
      ],
      { cancelable: true }
    );
  };

  const handleContactUs = async () => {
    const url =
      `mailto:${email}` +
      `?subject=Segunda Mano Support` +
      `&body=From: ${email}%0A%0AHello, I need help with:%0A`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No email app found on this device.");
    }
  };

  const handleMenuPress = (action: () => void) => {
    setMenuVisible(false);
    setTimeout(() => {
      action();
    }, 100);
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
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={26} color="#DC143C" />
        </TouchableOpacity>
      </View>

      {/* PROFILE */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
        <Image style={styles.avatar} source={getImageSource()} />

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.usernameText}>{username}</Text>

          {sellerAvgRating === null ? (
            <Text style={{ fontSize: 12, color: "#777" }}>
              No ratings yet
            </Text>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {renderStars(sellerAvgRating)}
              <Text style={{ marginLeft: 6 }}>
                {sellerAvgRating.toFixed(1)} ({ratingCount})
              </Text>
            </View>
          )}

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
        userListings.length === 0 ? (
          <View style={styles.centerContent}>
            <Text>No Listings Available</Text>
          </View>
        ) : (
          <FlatList
            key="grid"
            data={userListings}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ padding: 8, paddingBottom: 80 }}
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
        )
      ) : activeTab === "reviews" ? (
        reviews.length === 0 ? (
          <View style={styles.centerContent}>
            <Text>No ratings yet</Text>
          </View>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
            renderItem={({ item }) => (
              <RatingCard item={item} />
            )}
          />
        )
      ) : activeTab === "my Orders" ? (
        orders.length === 0 ? (
          <View style={styles.centerContent}>
            <Text>No orders yet</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
            renderItem={({ item }) => (
              <OrderCard
                item={item}
                onCancel={async () => {
                  Alert.alert(
                    "Cancel Order",
                    "Are you sure you want to cancel this order?",
                    [
                      { text: "No" },
                      {
                        text: "Yes",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await updateDoc(doc(db, "orders", item.id), {
                              deliveryStatus: "CANCELLED",
                            });
                            if (item.listingId) {
                              await updateDoc(doc(db, "listings", item.listingId), {
                                available: true,
                              });
                            }
                            Alert.alert(
                              "Order Cancelled",
                              "Your order has been cancelled successfully."
                            );
                          } catch (err) {
                            console.log(err);
                            Alert.alert("Error", "Failed to cancel order");
                          }
                        }
                      },
                    ]
                  );
                }}
              />
            )}
          />
        )
      ) : null }

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuPanel}>
            <Text style={styles.menuTitle}>MENU</Text>

            <TouchableOpacity onPress={handleContactUs}>
              <Text style={styles.menuText}>Contact Us</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("../profileMenu/details")}>
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("../profileMenu/passwordChange")}>
              <Text style={styles.menuText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("../profileMenu/about")}>
              <Text style={styles.menuText}>About Segunda Mano</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.menuText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}