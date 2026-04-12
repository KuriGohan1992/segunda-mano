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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import {
  doc,
  getDoc,
  updateDoc,
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

  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [tempImage, setTempImage] = useState("");
  const [activeTab, setActiveTab] = useState("listings");

  const [userListings, setUserListings] = useState<Listing[]>([]);

  const isOwnProfile = true;

  useEffect(() => {
    async function getUserDetails() {
      setLoading(true);

      if (!uid) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", uid);
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

    getUserDetails();
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

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your gallery."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setTempImage(base64Img);
    }
  };

  const saveImage = async () => {
    if (!uid || !tempImage) return;

    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { picture: tempImage });

    setPicture(tempImage);
    setModalVisible(false);
    setTempImage("");
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
        {isOwnProfile && (
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cover} />

      <View style={styles.profileSection}>
        <View>
          <Image style={styles.avatar} source={getImageSource()} />

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.cameraButton}
          >
            <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
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

              <Text style={styles.label}>Email</Text>
              <Text>{email}</Text>

              <Text style={styles.label}>Address</Text>
              <Text>{address}</Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal transparent visible={modalVisible}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setModalVisible(false);
            setTempImage("");
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={styles.modalBox}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imagePickerCircle}
            >
              {tempImage ? (
                <Image
                  source={{ uri: tempImage }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.plusText}>＋</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={saveImage} style={styles.saveButton}>
              <Text style={styles.saveText}>Save Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setTempImage("");
              }}
              style={styles.cancelButton}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal transparent visible={menuVisible}>
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuPanel}>
            {[
              "Account Settings",
              "Display Settings",
              "Help and Support",
              "Settings and Privacy",
            ].map((item) => (
              <TouchableOpacity key={item}>
                <Text style={styles.menuText}>{item}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.menuLogout}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}