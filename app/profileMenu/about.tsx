import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../(tabs)/styles";

export default function About() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#DC143C" />
        </TouchableOpacity>

        <Text style={styles.title}>About Us</Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 10,
        }}
      >
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Segunda Mano</Text>

          <Text style={styles.aboutText}>
            Segunda Mano is an online shopping platform designed to make buying
            and selling second-hand items simple, fast, and accessible.
          </Text>

          <Text style={styles.sectionHeaderText}>Features</Text>

          <Text style={styles.aboutBullet}>• Browse listings</Text>
          <Text style={styles.aboutBullet}>• Chat with sellers</Text>
          <Text style={styles.aboutBullet}>• Manage your items</Text>
          <Text style={styles.aboutBullet}>• Save items to your carton</Text>

          <Text style={styles.sectionHeaderText}>Our Mission</Text>

          <Text style={styles.aboutText}>
            We promote sustainable shopping by encouraging reuse and reducing
            waste through a simple and reliable platform.
          </Text>
        </View>

        <Text style={styles.aboutFooter}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}