import React, { useState } from "react";
import UnderDevelopment from "../../components/UnderDevelopment";
import DropDownPicker from "react-native-dropdown-picker";
import { CATEGORIES } from "../../constants/categories";
import {
  View,
  Text,
  Alert,
  Keyboard,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../../components/CustomInput";
import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import { CONDITIONS } from "../../constants/condition";
import CustomButton from "../../components/CustomButton";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { db } from "../../firebase";
import { router } from "expo-router";

export default function Sell() {
  const [loading, setLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [openCondition, setOpenCondition] = useState(false);
  const [condition, setCondition] = useState<string | null>(null);
  const { user } = useUser();
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.4,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageBase64(result.assets[0].base64);
    }
  };

  function handleSetOpenCategory(v: boolean) {
    setOpenCategory(v);
    if (v) setOpenCondition(false); // close the other when opening this
  }
  function handleSetOpenCondition(v: boolean) {
    setOpenCondition(v);
    if (v) setOpenCategory(false); // close the other when opening this
  }

  const { control, handleSubmit, reset } = useForm();

  const addListingPressed = async (data: any) => {
    if (!condition || !category) {
      Alert.alert("Error", "Please fill-in both condition and category");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    if (!imageBase64) {
      Alert.alert("Error", "Please pick an image");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const { title, price, description } = data;

      if (!price || Number.isNaN(Number(price))) {
        Alert.alert("Validation", "Please enter a valid price.");
        return;
      }

      let userLocation = "";
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        userLocation = userSnap.data().address || "";
      }

      await addDoc(collection(db, "listings"), {
        available: true,
        title,
        price: Number(price),
        description: description?.trim() || "",
        category,
        condition,
        images: [imageBase64],
        location: userLocation,
        sellerId: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Listing added successfully!", [
        {
          text: "OK",
          onPress: () => {
            reset();
            setImageBase64(null);
            setCategory(null);
            setCondition(null);
            router.replace("/");
          },
        },
      ]);
    } catch (err) {
      console.error("add listing error", err);
      Alert.alert("Error", "There was a problem adding the listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { alignItems: "center", padding: 20 }]}
    >
      <Text style={styles.title}>List an Item</Text>

      <View style={{ height: 100}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 5 }}
        >
          
          {imageBase64 && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
              style={{ width: 200, height: 200, borderRadius: 8, marginLeft: 10 }}
            />
          )}

          <TouchableOpacity onPress={pickImage} style={styles.FirstBox}>
            <Text style={styles.text_image}>+</Text>
            <Text style={styles.text_image}>Add</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      <CustomInput
        name="title"
        rules={{ required: "Title is required" }}
        placeholder="Title"
        control={control}
      />

      <CustomInput
        name="price"
        rules={{ required: "Price is required" }}
        keyboardType="numeric"
        placeholder="Price"
        control={control}
      />

      <View style={{ zIndex: 2, elevation: 2 }}>
        <DropDownPicker
          open={openCondition}
          value={condition}
          items={CONDITIONS.map((i) => ({ label: i, value: i }))}
          setOpen={handleSetOpenCondition}
          setValue={setCondition}
          placeholder="Select Condition"
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          listItemLabelStyle={styles.dropdownInput}
          labelStyle={styles.dropdownInput}
          listItemContainerStyle={styles.listItemContainerStyle}
          dropDownContainerStyle={styles.dropdown}
        />
      </View>

      <CustomInput
        name="description"
        placeholder="Description"
        multiline
        control={control}
      />

      <View style={{ zIndex: 1, elevation: 1 }}>
        <DropDownPicker
          onPress={Keyboard.dismiss}
          open={openCategory}
          value={category}
          items={CATEGORIES.slice(1).map((i) => ({ label: i, value: i }))}
          setOpen={handleSetOpenCategory}
          setValue={setCategory}
          placeholder="Select Category"
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          listItemLabelStyle={styles.dropdownInput}
          labelStyle={styles.dropdownInput}
          listItemContainerStyle={styles.listItemContainerStyle}
          dropDownContainerStyle={styles.dropdown}
        />
      </View>

      <Text style={styles.text}>
        By tapping Add Listing, you agree that your post follows our{" "}
        <Text style={styles.link}>Listing Policy</Text> and{" "}
        <Text style={styles.link}>Community Standards</Text>
      </Text>

      <CustomButton
        text="Add Listing"
        loading={loading}
        onPress={handleSubmit(addListingPressed)}
      />
    </SafeAreaView>
  );
}
