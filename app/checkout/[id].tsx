import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../../firebase";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ADDRESS } from "@/constants/address";
import { img_placeholder } from "@/constants/img_placeholder";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/context/UserContext";

export default function Checkout() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const uid = user?.uid;

  const [sellerMobile, setSellerMobile] = useState<string | null>(null);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkout = httpsCallable(functions, "createCheckout");
  const [address, setAddress] = useState<string>("");
  const [openAddress, setOpenAddress] = useState(false);

  function handleSetOpenAddress(v: boolean) {
    setOpenAddress(v);
  }
  const [specificAddress, setSpecificAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  const SHIPPING_FEES: any = {
    "Calamba, Laguna": 349,
    "Sto. Tomas, Batangas": 149,
    "Tanauan City, Batangas": 249,
    "Malvar, Batangas": 299,
  };

  const adminFee = listing ? Math.round(listing.price * 0.01) : 0;
  const [shippingFee, setShippingFee] = useState(SHIPPING_FEES[address] || 0)
  const total = listing ? listing.price + adminFee + shippingFee : 0;

  const [sellerName, setSellerName] = useState("");

  useEffect(() => {
    // setShippingFee(SHIPPING_FEES[address])
    setShippingFee(0);
  }, [address]);

  useEffect(() => {
    async function fetchUser() {
      if (!uid) {
        return;
      }

      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const d: any = snap.data();
        setAddress(d.address || "");
        setSpecificAddress(d.specificAddress || "");
      }

      setLoading(false);
    }

    fetchUser();
  }, [uid]);

  useEffect(() => {
    const fetchSeller = async () => {
      if (!listing?.sellerId) return;

      const ref = doc(db, "users", listing.sellerId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data()
        setSellerName(data.username);
        setSellerMobile(data.mobileNumber || null);
      }
    };

    fetchSeller();
  }, [listing]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      const ref = doc(db, "listings", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setListing({
          id: snap.id,
          ...snap.data(),
        });
      } else {
        console.log("Listing not found");
      }

      setLoading(false);
    };

    fetchListing();
  }, [id]);

  const handlePay = async () => {
    if (!listing || loading) return;

    if (!specificAddress) {
      Alert.alert("Missing address", "Please enter your full address");
      return;
    }

    if (!uid) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    setLoading(true);
    const freshSnap = await getDoc(doc(db, "listings", listing.id));

    if (!freshSnap.exists() || !freshSnap.data().available) {
      Alert.alert("Item unavailable", "This item has already been taken.");
      setLoading(false);
      return;
    }

    const orderRef = doc(collection(db, "orders"));
    const orderId = orderRef.id;
    // console.log(orderId);

    try {
      if (paymentMethod === "COD") {
        await setDoc(orderRef, {
          userId: uid,
          sellerId: listing.sellerId,
          listingId: listing.id,
          amount: total,
          paymentStatus: "COD",
          deliveryStatus: "PLACED",
          paymentMethod: "COD",
          listingName: listing.title,
          address,
          specificAddress,
          isCompleted: false,
          createdAt: serverTimestamp(),
          paidAt: null,
        });

        await updateDoc(doc(db, "users", uid), {
          specificAddress,
        });

        await updateDoc(doc(db, "listings", listing.id), {
          available: false
        });
        Alert.alert(
          "Order placed successfully", 
          "Your order will be processed shortly.",
          [{ text: "OK", onPress: () => router.replace("/(tabs)/profile?tab=my Orders") }]
        );
        return;
      }

      const res: any = await checkout({
        userId: uid,
        sellerId: listing.sellerId,
        listingId: listing.id,
        amount: Math.round(total * 100),
        listingName: listing.title,
        address,
        specificAddress,
        isCompleted: false,
        description: `Order for "${listing.title}"`,
        orderId: orderId,
      });

      Linking.openURL(res.data);

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !listing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  const rawImage =
    listing?.images?.[0] || listing?.thumbnail;

  const imageUri =
    rawImage
      ? rawImage.startsWith("http")
        ? rawImage
        : `data:image/jpeg;base64,${rawImage}`
      : img_placeholder;

  return (
    <SafeAreaView style={styles.container}>        
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#DC143C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
        <View style={styles.checkoutRow}>

          <Image
            source={{ uri: imageUri }}
            style={styles.checkoutImage}
          />

          <View style={styles.checkoutMeta}>
            <Text numberOfLines={2} style={styles.checkoutTitle}>
              {listing.title}
            </Text>

            <Text style={styles.checkoutCondition}>
              {listing.condition}
            </Text>

            <Text style={styles.checkoutPrice}>
              ₱ {listing.price}
            </Text>

            <Text style={styles.checkoutSeller}>
              {sellerName}
            </Text>
          </View>

        </View>

        <View style={styles.divider} />

        <Text style={styles.section}>Delivery Address</Text>

        <TextInput
          placeholder="House No. / Street / Barangay"
          value={specificAddress}
          onChangeText={setSpecificAddress}
          style={styles.input}
        />

        <View style={{ zIndex: 2, elevation: 2 }}>
          <DropDownPicker
            open={openAddress}
            value={address}
            listMode="SCROLLVIEW"
            items={ADDRESS.map((i) => ({ label: i, value: i }))}
            setOpen={handleSetOpenAddress}
            setValue={setAddress}
            placeholder="Select Address"
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            listItemLabelStyle={styles.dropdownInput}
            labelStyle={styles.dropdownInput}
            listItemContainerStyle={styles.listItemContainerStyle}
            dropDownContainerStyle={styles.dropdown}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.section}>Payment Method</Text>

        <TouchableOpacity
          style={[styles.option, paymentMethod === "COD" && styles.selected]}
          onPress={() => setPaymentMethod("COD")}
        >
          <Text style={styles.optionText}>Cash on Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          // disabled={!sellerMobile}
          style={[
            styles.option,
            paymentMethod === "ONLINE" && styles.selected,
            !sellerMobile && styles.disabledOption
          ]}
          onPress={() => {
            if (!sellerMobile) {
              Alert.alert(
                "Online Payment Unavailable",
                "This seller hasn’t added a payment number yet."
              );
              return;
            }
            setPaymentMethod("ONLINE");
          }}
        >
          <Text
            style={[
              styles.optionText,
              !sellerMobile && styles.disabledText
            ]}
          >
            QRPH (Gcash, Maya, etc...)
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.section}>Summary</Text>

        <View style={styles.row}>
          <Text style={styles.smallText}>Item</Text>
          <Text style={styles.smallText}>₱ {listing.price}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.smallText}>Admin Fee (1%)</Text>
          <Text style={styles.smallText}>₱ {adminFee}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.smallText}>Shipping</Text>
          <Text style={styles.smallText}>₱ {shippingFee}</Text>
        </View>

        <View style={[styles.row, { marginTop: 10 }]}>
          <Text style={ [styles.smallText, { fontWeight: "bold" }]}>Total</Text>
          <Text style={ [styles.smallText, { fontWeight: "bold", color: "#DC143C" }]}>
            ₱ {total}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePay}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16}}>
            {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#DC143C",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  title: {
    fontWeight: "600",
  },

  price: {
    marginTop: 5,
    fontWeight: "bold",
    color: "#DC143C",
  },

  section: {
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 17,
    color: "#555",
  },

  input: {
    backgroundColor: "#fff",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginVertical: 5,
    color: "#333"
  },

  option: {
    backgroundColor: "#fff",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 5,
  },

  optionText: {
    fontSize: 16,
    color: "#333"
  },

  selected: {
    borderColor: "#DC143C",
    backgroundColor: "#ffe5ea",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  button: {
    marginTop: 16,
    backgroundColor: "#DC143C",
    padding: 14,
    borderRadius: 10,
  },

  checkoutRow: {
    flexDirection: "row",
    paddingEnd: 14,
    alignItems: "center",
  },

  checkoutImage: {
    width: 150,
    height: 150,
    borderRadius: 4,
    marginRight: 14,
    backgroundColor: "#eee",
  },

  checkoutMeta: {
    flex: 1,
  },

  checkoutTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },

  checkoutCondition: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6
  },

  checkoutPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#DC143C",
    marginBottom: 6,
  },

  checkoutSeller: {
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },

  smallText: {
    color: "#666",
    fontSize: 15
  },

  dropdown: {
    backgroundColor: 'white',
    width: '100%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 12,

  },

  dropdownInput: {
    fontSize: 16,
    color: '#333',
  }, 

  placeholderStyle: {
    color: '#c5c5c7', fontSize: 16,
  },

  listItemContainerStyle: { 
    height: 45, borderBottomColor: '#e8e8e8', borderBottomWidth: 0.5
  },

  disabledOption: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
  },

  disabledText: {
    color: "#aaa",
  },

});