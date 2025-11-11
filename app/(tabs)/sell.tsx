import React, { useState } from "react";
import UnderDevelopment from "../../components/UnderDevelopment";
import DropDownPicker from 'react-native-dropdown-picker';
import { CATEGORIES } from "../../constants/categories";
import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../../components/CustomInput";
import { useForm } from "react-hook-form";
import styles from "./styles";
import { CONDITIONS } from "../../constants/condition";
import CustomButton from "../../components/CustomButton";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { db } from "../../firebase";
import { router } from "expo-router";

export default function Sell() {
  const [loading, setLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [category, setCategory] = useState(null);
  const [openCondition, setOpenCondition] = useState(false);
  const [condition, setCondition] = useState(null);
  const { user, setUser } = useUser();

  function handleSetOpenCategory(v: boolean) {
    setOpenCategory(v);
    if (v) setOpenCondition(false); // close the other when opening this
  }
  function handleSetOpenCondition(v: boolean) {
    setOpenCondition(v);
    if (v) setOpenCategory(false); // close the other when opening this
  }

  const {control, handleSubmit, reset} = useForm();

  const addListingPressed = async (data) => {
    console.log('condition:', condition, 'category:', category);
    if (!condition || !category) {
      alert('Please fill-in both condition and category');
      return;
    }
    if (loading) return;
    setLoading(true);
    
    try {
      const uid = user?.uid;
      const {image, title, price, description} = data;
      
      if (!price || Number.isNaN(Number(price))) {
        Alert.alert('Validation', 'Please enter a valid price.');
        return;
      }
      let userLocation = '';
      if (uid) {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const d = userSnap.data() as any;
          userLocation = d.address
        }
      }

      const images = Array.isArray(image) ? image.filter(Boolean) : image ? [image] : [];
      const thumbnail = images.length > 0 ? images[0] : '';      
      
      const docRef = await addDoc(collection(db, "listings"), {
        available: true,
        category: category || 'Other',
        condition: condition || 'No Label',
        createdAt: serverTimestamp(),
        description: description || '',
        images,
        location: userLocation,
        price: Number(price),
        sellerId: uid,
        thumbnail,
        title: title,
      });
      Alert.alert('Success', 'Listing added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            setCategory(null);
            setCondition(null);
            router.replace('/')
          }
        }
      ]);
      reset();
    } catch (err) {
      console.error('add listing error', err);
      Alert.alert('Error', 'There was a problem adding the listing.');
    } finally {
      setLoading(false);
    }

  }


  return (
    <SafeAreaView style={[styles.container, {alignItems: 'center', padding: 20}]}>
      <Text style={styles.title}>List an Item</Text>
      <CustomInput
        name="image"
        placeholder={"Image URL"}
        control={control}
      />
      <CustomInput
        name="title"
        rules={{required: "Title is required"}}
        placeholder={"Title"}
        control={control}
      />
      <CustomInput
        name="price"
        rules={{required: "Price is required"}}
        keyboardType={"numeric"}
        placeholder={"Price"}
        control={control}
      />
      <View style={{zIndex: 2, elevation: 2,}}>
        <DropDownPicker
          open={openCondition}
          value={condition}
          items={CONDITIONS.map(i => ({ label: i, value: i }))}
          setOpen={handleSetOpenCondition}
          setValue={setCondition}
          placeholder={"Select Condition"}
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
        placeholder={"Description"}
        multiline={true}
        control={control}
      />

      <View style={{zIndex: 1, elevation: 1,}}>
        <DropDownPicker 
          onPress={Keyboard.dismiss}
          open={openCategory}
          value={category}
          items={CATEGORIES.slice(1).map(i => ({ label: i, value: i }))}
          setOpen={handleSetOpenCategory}
          setValue={setCategory}
          placeholder={"Select Category"}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          listItemLabelStyle={styles.dropdownInput}
          labelStyle={styles.dropdownInput}
          listItemContainerStyle={styles.listItemContainerStyle}
          dropDownContainerStyle={styles.dropdown}
        />
      </View>
      <Text style={styles.text}>By tapping Add Listing, you agree that your post follows our{" "}
        <Text style={styles.link}>Listing Policy</Text> and{" "} 
        <Text style={styles.link}>Community Standards</Text>
      </Text>
      <CustomButton
        text="Add Listing"
        loading={loading}
        onPress={handleSubmit(addListingPressed)}
      />
    </SafeAreaView>
  )
}
