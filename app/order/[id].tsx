import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { img_placeholder } from "@/constants/img_placeholder";
import { DEV_STATUS } from "@/constants/dev_status";
import { useUser } from "@/context/UserContext";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [order, setOrder] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState<string | null>(null); 
  const [condition, setCondition] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [sellerName, setSellerName]  = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState<string | null>(null);

  const { user } = useUser();
  const isSeller = order?.sellerId === user?.uid;
  const isBuyer = user?.uid === order?.userId;

  const canCancel = order?.deliveryStatus === "PLACED" && order.paymentMethod === "COD";

  const canComplete = order?.deliveryStatus === "DELIVERED" && isBuyer;

  const getPartyText = () => {
    const status = order.deliveryStatus;
    const isDone = ["DELIVERED", "COMPLETED"].includes(status);
    const isCancelled = status === "CANCELLED";

    if (isSeller) {
      if (isCancelled) return `Buyer: ${buyerName || "Unknown"}`;
      return isDone
        ? `Sold to: ${buyerName || "Unknown"}`
        : `Selling to: ${buyerName || "Unknown"}`;
    } else {
      if (isCancelled) return `Seller: ${sellerName || "Unknown"}`;
      return isDone
        ? `Bought from: ${sellerName || "Unknown"}`
        : `Buying from: ${sellerName || "Unknown"}`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const orderRef = doc(db, "orders", id as string);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          console.log("Order not found");
          setLoading(false);
          return;
        }

        const orderData = orderSnap.data();
        setOrder(orderData);

        if (orderData.listingId) {
          const listingRef = doc(db, "listings", orderData.listingId);
          const listingSnap = await getDoc(listingRef);

          if (listingSnap.exists()) {
            const d: any = listingSnap.data();
            setImage(d.images?.[0] || d.thumbnail || null);
            setTitle(d.title)
            setCondition(d.condition)
            setPrice(d.price)

          }
        }

        if (orderData.userId) {
          const bRef = doc(db, "users", orderData.userId);
          const bSnap = await getDoc(bRef);

          if (bSnap.exists()) {
            setBuyerName(bSnap.data()?.username || null);
          }
        }
        
        if (orderData.sellerId) {
        const sRef = doc(db, "users", orderData.sellerId);
        const sSnap = await getDoc(sRef);

        if (sSnap.exists()) {
            setSellerName(sSnap.data()?.username || null);
        }
        }

      } catch (err) {
        console.log("Error:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  const imageUri = image
    ? image.startsWith("http")
      ? image
      : `data:image/jpeg;base64,${image}`
    : img_placeholder;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "";
        const date = timestamp.toDate?.() || new Date(timestamp);
        return date.toLocaleString();
        };
  return (
    <SafeAreaView style={styles.container}>
    
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#DC143C" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Order Details</Text>

        <View style={{ width: 28 }} />
      </View>


      <View style={styles.orderRow}>
        <Image source={{ uri: imageUri }} style={styles.orderImage} />

        <View style={styles.orderMeta}>
          <Text numberOfLines={2} style={styles.orderTitle}>
            {title}
          </Text>

          <Text style={styles.orderCondition}>
            {condition}
          </Text>

          <Text style={styles.orderPrice}>
            ₱ {price}
          </Text>
          <Text style={styles.party}>
            {getPartyText()}
          </Text>
        </View>

      </View>

      <View style={styles.divider} />

      <View style={styles.detailsCard}>
  
        <Text style={styles.sectionTitle}>Order Information</Text>

        <View style={styles.row}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>{id}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Listing Name:</Text>
            <Text style={styles.value}>{order.listingName}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Total Price:</Text>
            <Text style={styles.value}>
            ₱ {Number(order.amount || 0).toLocaleString()}
            </Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>
            {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Online Payment"}
            </Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Payment Status:</Text>
            <Text style={styles.value}>{order.paymentStatus === "COD"
                ? "Not Paid"
                : "Paid"}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Delivery Status:</Text>
            <Text style={styles.value}>{DEV_STATUS[order.deliveryStatus]}</Text>
        </View>



        <View style={styles.row}>
            <Text style={styles.label}>Delivery Address:</Text>
            <Text style={styles.value}>
            {order.specificAddress}, {order.address}
            </Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>
            {formatDate(order.createdAt)}
            </Text>
        </View>

      </View>
      <View style={styles.actions}>
  
        {canCancel && (
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={async () => {
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
                            await updateDoc(doc(db, "orders", id as string), {
                              deliveryStatus: "CANCELLED",
                            });
                            if (order.listingId) {
                              await updateDoc(doc(db, "listings", order.listingId), {
                                available: true,
                              });
                            }
                            Alert.alert(
                              "Order Cancelled",
                              "Your order has been cancelled successfully."
                            );
                            router.back();
                          } catch (err) {
                            console.log(err);
                            Alert.alert("Error", "Failed to cancel order");
                          }
                        }
                      },
                    ]
                  );
                }}
          >
            <Text style={styles.completeText}>Cancel Order</Text>
          </TouchableOpacity>
        )}

        {/* COMPLETE (BUYER ONLY) */}
        {canComplete && (
          <TouchableOpacity
            style={styles.completeBtn}
            //jade ito sayo boi
          >
            <Text style={styles.completeText}>Complete Order</Text>
          </TouchableOpacity>
        )}

      </View>
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

  orderRow: {
    flexDirection: "row",
    paddingEnd: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  orderImage: {
    width: 150,
    height: 150,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    marginRight: 14,
    backgroundColor: "#eee",
  },

  orderMeta: {
    flex: 1,
  },

  orderTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },

  orderCondition: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6
  },

  orderPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#DC143C",
    marginBottom: 6,
  },

  orderSeller: {
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },

    detailsCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#eee",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
        color: "#333",
    },

    row: {
        flexDirection: "row",
        marginBottom: 14,
    },

    label: {
        width: "40%",
        fontSize: 15,
        color: "#666",
    },

    value: {
        flex: 1,
        fontSize: 15,
        color: "#333",
    },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 15,
  },
  party: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
    marginTop: 4,
  },

  actions: {
    marginTop: 20,
    gap: 10,
  },

  // cancelBtn: {
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderColor: "#DC143C",
  //   paddingVertical: 12,
  //   borderRadius: 8,
  // },

  // cancelText: {
  //   color: "#DC143C",
  //   textAlign: "center",
  //   fontWeight: "700",
  // },

  completeBtn: {
    backgroundColor: "#DC143C",
    paddingVertical: 12,
    borderRadius: 8,
  },

  completeText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});