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
  TextInput,
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

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const uid = user?.uid;
  const email = user?.email;
  const [picture, setPicture] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [activeTab, setActiveTab] = useState("listings");
  const [userListings, setUserListings] = useState<Listing[]>([]);

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

        setGender(d.gender || "Not Specified");
        setContactNumber(d.contactNumber || "Not Specified");
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

  const handleSendSupport = async () => {
    if (!message.trim()) return;

    const url =
      `mailto:jadeddragon26@gmail.com` +
      `?subject=Segunda Mano Support` +
      `&body=From: ${email}%0A%0AMessage:%0A${message}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
      setMessage("");
      setContactModalVisible(false);
    } else {
      Alert.alert("Error", "No email app found on this device.");
    }
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
      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.cover} />

      <View style={styles.profileSection}>
        <Image style={styles.avatar} source={getImageSource()} />

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

              <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.label}>Name</Text>
                <Text>{username}</Text>

                <Text style={styles.label}>Gender</Text>
                <Text>{gender}</Text>

                <Text style={styles.label}>Address</Text>
                <Text>{address}</Text>
              </View>

              <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                <Text style={styles.sectionHeaderText}>
                  Contact Information
                </Text>
              </View>

              <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.label}>Email</Text>
                <Text>{email}</Text>

                <Text style={styles.label}>Contact Number</Text>
                <Text>{contactNumber}</Text>

              </View>
            </View>
          )}
        </ScrollView>
      )}

      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuPanel]}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 16,
                color: "white",
              }}
            >
              MENU
            </Text>

            <TouchableOpacity onPress={() => {
              setMenuVisible(false);
              setContactModalVisible(true);
            }}>
              <Text style={styles.menuText}>Contact Us</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("../profileMenu/details")}>
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("../profileMenu/listings")}>
              <Text style={styles.menuText}>Edit Listings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("../profileMenu/about")}>
              <Text style={styles.menuText}>About Segunda Mano</Text>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 12 }} />

            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.menuLogout}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={contactModalVisible} animationType="fade">
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setContactModalVisible(false)}
        >
          <View style={[styles.menuPanel, { backgroundColor: "#fff" }]}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
              Contact Support
            </Text>

            <TextInput
              placeholder="Input message"
              value={message}
              onChangeText={setMessage}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 10,
                minHeight: 100,
                marginBottom: 12,
                textAlignVertical: "top",
              }}
            />

            <TouchableOpacity
              onPress={handleSendSupport}
              style={{
                backgroundColor: "#DC143C",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Send
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setContactModalVisible(false);
                setMenuVisible(true);
              }}
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}