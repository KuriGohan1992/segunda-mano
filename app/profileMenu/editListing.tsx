import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Listing } from "../../type/listing";
import styles from "../(tabs)/styles";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useForm } from "react-hook-form";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { CONDITIONS } from "../../constants/condition";
import { CATEGORIES } from "../../constants/categories";

export default function EditListing() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { control, handleSubmit, setValue } = useForm();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<Listing | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [condition, setCondition] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const [openCondition, setOpenCondition] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;

      const docRef = doc(db, "listings", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data() as Listing;

        setListing(data);

        setValue("title", data.title);
        setValue("price", String(data.price));
        setValue("description", data.description);

        setImages(data.images || []);
        setCondition(data.condition);
        setCategory(data.category);
      }

      setLoading(false);
    }

    fetchListing();
  }, [id]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.4,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImages((prev) => [...prev, result.assets[0].base64!]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onUpdate = async (data: any) => {
    if (!id) return;

    await updateDoc(doc(db, "listings", id), {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      images,
      condition,
      category,
    });

    Alert.alert("Success", "This product has been updated");
    router.back();
  };

  const onDelete = async () => {
    if (!id) return;

    await deleteDoc(doc(db, "listings", id));

    Alert.alert("Deleted", "This product has been deleted");
    router.back();
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

        <Text style={styles.title}>Edit Product Listing</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          padding: 20,
          paddingTop: 10,
        }}
      >
        <View style={{ height: 100 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            {images.map((img, index) => (
              <View key={index} style={styles.imageBox}>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${img}` }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />

                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>X</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity onPress={pickImage} style={styles.FirstBox}>
              <Text style={styles.text_image}>
                +{"\n"}Add Image
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{ width: "100%" }}>
          <Text style={styles.BoxTitle}>Title</Text>
          <CustomInput name="title" control={control} placeholder="Title" />

          <Text style={styles.BoxTitle}>Price</Text>
          <CustomInput name="price" control={control} placeholder="Price" />

          <Text style={styles.BoxTitle}>Description</Text>
          <CustomInput
            name="description"
            control={control}
            placeholder="Description"
            multiline
          />

          <Text style={styles.BoxTitle}>Condition</Text>
          <DropDownPicker
            open={openCondition}
            value={condition}
            items={CONDITIONS.map((i) => ({ label: i, value: i }))}
            setOpen={setOpenCondition}
            setValue={setCondition}
            placeholder="Condition"
            style={styles.dropdown}
          />

          <Text style={styles.BoxTitle}>Category</Text>
          <DropDownPicker
            open={openCategory}
            value={category}
            items={CATEGORIES.map((i) => ({ label: i, value: i }))}
            setOpen={setOpenCategory}
            setValue={setCategory}
            placeholder="Category"
            style={styles.dropdown}
          />
        </View>
        <View style={{ marginTop: 20, width: "100%" }}>
          <CustomButton text="Update" onPress={handleSubmit(onUpdate)} />
          <View style={{ height: 10 }} />
          <CustomButton text="Delete" onPress={onDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}