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
import { useRouter } from "expo-router";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./styles";
import { Listing } from "../../type/listing";
import { img_placeholder } from "../../constants/img_placeholder";
import ListingCard from "../../components/ListingCard";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const [menuVisible, setMenuVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("listings");
  const [userListings, setUserListings] = useState<Listing[]>([]);

  const tabs = ["listings", "reviews", "about"];
  const activeIndex = tabs.indexOf(activeTab);

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
      `mailto:jadeddragon26@gmail.com` +
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

      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={26} color="#DC143C" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
        <Image style={styles.avatar} source={getImageSource()} />

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.usernameText}>{username}</Text>
          <Text style={styles.infoText}>{address}</Text>
          <Text style={styles.infoText}>Joined {joinedDate}</Text>
        </View>
      </View>

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

      {activeTab === "listings" ? (
        userListings.length === 0 ? (
          <View style={styles.centerContent}>
            <Text>No Listings Available</Text>
          </View>
        ) : (
          <FlatList
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.centerContent}>
            <Text>No ratings yet</Text>
          </View>
        </ScrollView>
      ) : activeTab === "about" ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.centerContent}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
              About You
            </Text>
            <Text style={{ textAlign: "center", color: "#666" }}>
              This section will soon contain your activity history, including
              purchases, sales, and interactions on Segunda Mano.
            </Text>
          </View>
        </ScrollView>
      ) : null}

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuPanel}>
            <Text style={styles.menuTitle}>MENU</Text>

            <TouchableOpacity
              onPress={() =>
                handleMenuPress(handleContactUs)
              }
            >
              <Text style={styles.menuText}>Contact Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() =>
                handleMenuPress(() => router.push("../profileMenu/details"))
              }
            >
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleMenuPress(() => router.push("../profileMenu/passwordChange"))
              }
            >
              <Text style={styles.menuText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleMenuPress(() => router.push("../profileMenu/about"))
              }
            >
              <Text style={styles.menuText}>About Segunda Mano</Text>
            </TouchableOpacity>


            <View style={styles.menuDivider} />

            <TouchableOpacity
              onPress={() =>
                handleMenuPress(handleLogout)
              }
            >
              <Text style={styles.menuText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}