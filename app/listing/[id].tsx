import React, { useRef, useState, useCallback } from "react";
import {
  Image,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Listing } from "../../type/listing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { img_placeholder } from "../../constants/img_placeholder";
import { useUser } from "../../context/UserContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

export default function ListingDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [seller, setSeller] = useState<string | null>("");
  const [picture, setPicture] = useState<string | null>("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState(false);
  const [sellerId, setSellerId] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useUser();
  const uid = user?.uid;

  const handleScroll = (event: any) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / Dimensions.get("window").width
    );
    setCurrentImageIndex(slide);
  };

  const onMark = async () => {
    if (!id) return;
    Alert.alert(
      "Resolve Listing", 
      `This will mark the item as ${isLF ? "found" : "sold"} and close this listing permanently.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: isLF ? "Mark as Found" : "Mark as Sold",
          style: "destructive",
          onPress: async () => {
            await updateDoc(doc(db, "listings", id), {
              available: false
            });
              setListing(prev => prev ? { ...prev, available: false } : prev);
          }
        }
      ],
      { cancelable: true }
    )
  }
  const onDelete = async () => {
    if (!id) return;

    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "listings", id));
            Alert.alert("Deleted", "Your product has been deleted");
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const fetchListing = async () => {
    if (!id) return;
    setLoading(true);
    const docRef = doc(db, "listings", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      Alert.alert("Listing removed", "This item is no longer available.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
      ]);

      setLoading(false);
      return;
    } else {
      const d = docSnap.data() as any;

      const fetchedListing: Listing = {
        id: docSnap.id,
        available: d.available ?? true,
        category: d.category || "",
        condition: d.condition || "",
        type: d.type,
        createdAt:
          new Date(d.createdAt.seconds * 1000)
            .toDateString()
            .slice(4) || new Date().toISOString(),
        description: d.description || "",
        images: Array.isArray(d.images) ? d.images : [],
        thumbnail: Array.isArray(d.images)
          ? d.images[0]
          : img_placeholder,
        location: d.location || "",
        price: d.price ?? 0,
        sellerId: d.sellerId || "",
        title: d.title || "",
      };

      setListing(fetchedListing);

      if (uid) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const u = userSnap.data() as any;
          setInCart(u.carton.includes(id));
        }
      }

      if (fetchedListing.sellerId) {
        const sellerRef = doc(db, "users", fetchedListing.sellerId);
        const sellerSnap = await getDoc(sellerRef);

        if (sellerSnap.exists()) {
          const d = sellerSnap.data() as any;
          setSeller(d.username);
          setPicture(d.picture);
          setSellerId(fetchedListing.sellerId);
        } else {
          setSeller(null);
        }
      }
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchListing();
    }, [id, uid])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} size="large" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text>Listing not found.</Text>
      </View>
    );
  }

  const images =
    listing.images && listing.images.length > 0
    ? listing.images
    : [img_placeholder];

  const description =
    listing.description && listing.description.trim() !== ""
    ? listing.description
    : "No description available";

  const isOwner = uid === sellerId
  const isLF = listing.type === "lf";

  return (
    <>
      <TouchableOpacity style={styles.arrow} onPress={() => router.back()}>
        <Ionicons
          name="chevron-back"
          size={28}
          color="#FAFAFA"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              const uri = item.startsWith?.("http")
                ? item
                : `data:image/jpeg;base64,${item}`;

              return (
                <View style={{ width: Dimensions.get("window").width, height: 420 }}>
                  <Image
                    source={{ uri }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                      opacity: !listing.available ? 0.5 : 1,
                    }}
                  />

                  {!listing.available && (
                    <View style={styles.soldOverlay}>
                      <View style={styles.soldBadge}>
                        <Text style={styles.soldText}>
                          {listing.type === "lf" ? "FOUND" : "SOLD"}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
          />

          <View style={styles.imageIndicator}>
            <Text style={styles.indicatorText}>
              {currentImageIndex + 1}/{images.length}
            </Text>
          </View>
        </View>

        <View style={{ padding: 12 }}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>
            ₱ {Number(listing.price).toLocaleString()}
          </Text>

          <Text style={styles.field}>
            Condition:{" "}
            <Text style={{ fontWeight: 400 }}>{listing.condition}</Text>
          </Text>

          <Text style={styles.field}>Description:</Text>
          <Text style={styles.desc}>{description}</Text>

          <Text style={styles.field}>{isLF ? "Buyer" : "Seller"}:</Text>

          <TouchableOpacity
            onPress={() => router.push(`/seller/${sellerId}`)}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  margin: 4,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
                source={
                  picture
                    ? { uri: picture }
                    : require("../../assets/profile.png")
                }
              />
              <View style={{ justifyContent: "center" }}>
                <Text style={styles.seller}>{seller || "Unknown"}</Text>
                <Text style={[styles.seller, { fontWeight: 400 }]}>
                  {listing.location || "Unknown"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {listing.available ? (
        <>
          {uid !== sellerId ? (
            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <TouchableOpacity
                style={styles.action}
                onPress={() => router.push(`/chat/${sellerId}`)}
              >
                <Ionicons name="chatbubble-ellipses" size={26} color="#DC143C" />
                <Text style={styles.label}>Chat with {isLF ? "Buyer" : "Seller"}</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.action}
                onPress={async () => {
                  if (loading) return;
                  setLoading(true);

                  if (uid) {
                    if (inCart) {
                      setInCart(false);
                      await updateDoc(doc(db, "users", uid), {
                        carton: arrayRemove(id),
                      });
                      Alert.alert(
                        "Item Removed",
                        "This item has been removed from your Carton"
                      );
                    } else {
                      setInCart(true);
                      await updateDoc(doc(db, "users", uid), {
                        carton: arrayUnion(id),
                      });
                      Alert.alert(
                        "Item Added",
                        "This item has been added to your Carton"
                      );
                    }
                  }

                  setLoading(false);
                }}
              >
                <FontAwesome5 size={21} name="box-open" color="#DC143C" />
                <Text style={styles.label}>
                  {inCart ? "Remove Item" : "Add to Carton"}
                </Text>
              </TouchableOpacity>
                {!isLF && (
                <>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    style={styles.primary}
                    onPress={() => router.push(`../checkout/${listing.id}`)}
                  >
                    <FontAwesome5 name="box" size={21} color="#fff" />
                    <View>
                      <Text style={styles.primaryText}>Box it Now</Text>
                      <Text style={styles.primaryText}>
                        ₱ {Number(listing.price).toLocaleString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <TouchableOpacity
                style={styles.action}
                onPress={() =>
                  router.push({
                    pathname: "/profileMenu/editListing",
                    params: { id: listing.id },
                  })
                }
              >            
                <MaterialIcons name="mode-edit" size={26} color="#DC143C" />
                <Text style={styles.label}>Edit Listing</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.action} onPress={onDelete}>
                <MaterialIcons size={26} name="delete" color="#DC143C" />
                <Text style={styles.label}>
                  Delete Listing
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.primary, {paddingVertical: 15, flex: isLF ? 1.6 : 1.5}]}
                onPress={onMark}
              >
                <MaterialDesignIcons name="check-decagram" size={26} color="#fff" />
                <View>
                  <Text style={styles.primaryText}>Mark as {isLF ? "Found" : "Sold"}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <>
          {uid !== sellerId ? (
            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <View style={[styles.soldPrimary, {paddingVertical: 15}]}>
                <Text style={styles.soldPrimaryText}>This listing is no longer available</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <TouchableOpacity style={styles.action} onPress={onDelete}>
                <MaterialIcons size={26} name="delete" color="#DC143C" />
                <Text style={styles.label}>
                  Delete Listing
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}


    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  imageContainer: { position: "relative" },
  imageIndicator: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  indicatorText: { color: "#fff", fontSize: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  field: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 4,
    color: "#555",
  },
  price: { fontSize: 18, fontWeight: "800", color: "#DC143C", marginTop: 6 },
  desc: { marginLeft: 12, fontSize: 16, color: "#444", lineHeight: 24 },
  seller: {
    marginLeft: 8,
    marginTop: 4,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  arrow: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
  arrowIcon: {
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowRadius: 3,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#ddd",
  },

  action: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },

  primary: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC143C",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 12,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 6,
  },

  soldPrimary: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#f5c2c7",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 12,
  },

  soldPrimaryText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 6,
  },

  listingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC143C",
    marginHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },

  soldOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  soldBadge: {
    height: 80,
    width: 80,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 6,
    // paddingHorizontal: 16,
    borderRadius: 40,

    justifyContent: "center",
    alignItems: "center",
  },
  soldText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
