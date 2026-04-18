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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../(tabs)/styles";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useForm } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../../context/UserContext";

export default function Details() {
  const router = useRouter();
  const { user } = useUser();
  const uid = user?.uid;

  const { control, handleSubmit, setValue } = useForm();

  const [loading, setLoading] = useState(true);

  const [picture, setPicture] = useState("");
  const [gender, setGender] = useState<string | null>(null);

  const [openGender, setOpenGender] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!uid) return;

      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const d: any = snap.data();

        setValue("username", d.username || "");
        setValue("contactNumber", d.contactNumber || "");

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
    if (!uid) return;

    await updateDoc(doc(db, "users", uid), {
      username: data.username,
      gender,
      contactNumber: data.contactNumber,
      picture,
    });

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
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#DC143C" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 10,
        }}
      >
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

        <View
          style={{
            zIndex: openGender ? 2000 : 1000,
            elevation: openGender ? 2000 : 1000,
          }}
        >
          <Text style={styles.BoxTitle}>Gender</Text>
          <DropDownPicker
            open={openGender}
            value={gender}
            items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
            setOpen={setOpenGender}
            setValue={setGender}
            placeholder="Select Gender"
            style={styles.dropdown}
            listMode="SCROLLVIEW"
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <CustomButton text="Save" onPress={handleSubmit(onSave)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}