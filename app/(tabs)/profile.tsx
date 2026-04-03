import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import UnderDevelopment from "../../components/UnderDevelopment";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./styles";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();

  const uid = user?.uid;
  const email = user?.email;

  const [picture, setPicture] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState("");

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
    try {
      if (!uid || !tempImage) return;

      const docRef = doc(db, "users", uid);

      await updateDoc(docRef, {
        picture: tempImage,
      });

      setPicture(tempImage);
      setTempImage("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save image.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { alignItems: "center", justifyContent: "center" },
      ]}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{username}'s Profile</Text>
        <View>
          <Image
            style={[
              styles.avatar,
              {
                borderWidth: 2,
                borderColor: "#d11a2a",
              },
            ]}
            source={getImageSource()}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#d11a2a",
              borderRadius: 20,
              padding: 6,
            }}
          >
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{username}</Text>
        <Text style={styles.address}>{address}</Text>
        <Text style={styles.email}>{email}</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert(
              "Confirm Logout",
              "Are you sure you want to log out?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log Out",
                  style: "destructive",
                  onPress: () => {
                    router.replace("../(auth)");
                  },
                },
              ],
              { cancelable: true }
            );
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setModalVisible(false);
            setTempImage("");
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              width: 250,
              backgroundColor: "#fff",
              borderRadius: 15,
              padding: 20,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#eee",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                overflow: "hidden",
              }}
            >
              {tempImage ? (
                <Image
                  source={{ uri: tempImage }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Text style={{ fontSize: 30 }}>＋</Text>
              )}
            </TouchableOpacity>

            {/* SAVE */}
            <TouchableOpacity
              onPress={saveImage}
              style={{
                width: "100%",
                padding: 10,
                backgroundColor: "#d11a2a", // ✅ red
                borderRadius: 8,
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>Save Photo</Text>
            </TouchableOpacity>

            {/* CANCEL */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setTempImage("");
              }}
              style={{
                width: "100%",
                padding: 10,
                backgroundColor: "#ccc",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}