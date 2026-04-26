import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { getAuth, updatePassword } from "firebase/auth";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { control, handleSubmit, watch } = useForm();

  const [loading, setLoading] = useState(false);

  const newPassword = watch("password");

  const onChangePasswordPressed = async (data: any) => {
    const confirmPassword = data.confirmPassword;

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const auth = getAuth();
      const user = auth.currentUser!;

      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password updated successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#DC143C" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#DC143C",
          }}
        >
          Change Password
        </Text>
      </View>

      {/* CONTENT */}
      <View style={{ padding: 16 }}>
        <CustomInput
          name="password"
          placeholder="New Password"
          secureTextEntry
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 3,
              message: "Password should be minimum 3 characters long",
            },
          }}
        />

        <CustomInput
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry
          control={control}
          rules={{
            required: "Please confirm your password",
          }}
        />

        <View style={{ marginTop: 20 }}>
          <CustomButton
            text="Change Password"
            loading={loading}
            onPress={handleSubmit(onChangePasswordPressed)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}