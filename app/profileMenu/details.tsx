import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../(tabs)/styles";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useForm } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../../context/UserContext";
import { ADDRESS } from "@/constants/address";

export default function Details() {
  const router = useRouter();
  const { user } = useUser();
  const uid = user?.uid;

  const { control, handleSubmit, setValue } = useForm();

  const [loading, setLoading] = useState(true);

  const [picture, setPicture] = useState("");
  const [gender, setGender] = useState<string | null>(null);

  const [openGender, setOpenGender] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [openAddress, setOpenAddress] = useState(false);

  function handleSetOpenAddress(v: boolean) {
    setOpenAddress(v);
  }

  useEffect(() => {
    async function fetchUser() {
      if (!uid) return;

      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const d: any = snap.data();

        setValue("username", d.username || "");
        setValue("contactNumber", d.contactNumber || "");
        
        setAddress(d.address || "");
        setGender(d.gender || null);
        setPicture(d.picture || "");
      }

      setLoading(false);
    }

    fetchUser();
  }, [uid]);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPicture(base64Img);
    }
  };

  const onSave = async (data: any) => {
    if (loading) return;
    setLoading(true);
    if (!uid) return;

    await updateDoc(doc(db, "users", uid), {
      username: data.username,
      gender,
      contactNumber: data.contactNumber,
      picture,
      address
    });

    const q = query(
      collection(db, "listings"),
      where("sellerId", "==", uid)
    )

    const snapshot = await getDocs(q)

    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, "listings", docSnap.id), {
        location: address
      })
    )

    Alert.alert(
      "Success",
      "Your profile has been updated",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
    setLoading(false);
  };

  // if (loading) {
  //   return (
  //     <View style={styles.centerContent}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#DC143C" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <View style={{ width: 28 }} />
      </View>

      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 10,
        }}
      > */}
      <View style={{ padding: 20, paddingTop: 10 }}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                picture
                  ? { uri: picture }
                  : require("../../assets/profile.png")
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>

          <Text style={{ marginTop: 8, color: "#777" }}>
            Tap to change profile picture
          </Text>
        </View>

        <Text style={styles.BoxTitle}>Username</Text>
        <CustomInput
          name="username"
          control={control}
          placeholder="Username"
        />

        <Text style={styles.BoxTitle}>Contact Number</Text>
        <CustomInput
          name="contactNumber"
          control={control}
          placeholder="Contact Number"
        />
        <Text style={styles.BoxTitle}>Address</Text>
        <View style={{ zIndex: 2, elevation: 2 }}>
          <DropDownPicker
            open={openAddress}
            value={address}
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

        <View style={{ marginTop: 20 }}>
          <CustomButton text="Save" onPress={handleSubmit(onSave)} />
        </View>
      </View>
    </SafeAreaView>
  );
}