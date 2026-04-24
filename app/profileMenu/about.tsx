import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../(tabs)/styles";

export default function About() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#DC143C" />
        </TouchableOpacity>

        <Text style={styles.title}>About Us</Text>

        <View style={{ width: 28 }} />
      </View>

      <View style={{ flex: 1 }}>
        <Image
          source={require("../../assets/test_logo.png")}
          style={{
            position: "absolute",
            top: "25%",
            alignSelf: "center",
            justifyContent: "center",
            width: 300,
            height: 350,
            opacity: 0.3,
            zIndex: 0,
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 10,
          }}
        >
          <View style={[styles.aboutCard]}>
            <Text style={styles.aboutTitle}>Segunda Mano</Text>
            <Text style={styles.aboutText}>
              Segunda Mano is an online shopping platform designed to make
              buying and selling second-hand items simple, fast, and accessible.
              Our goal is to provide users with a smooth and reliable experience
              when browsing, listing, and managing pre-owned products.
            </Text>
            <Text style={styles.aboutSectionHeader}>What You Can Do</Text>
            <Text style={styles.aboutBullet}>
              • Browse a wide variety of second-hand items
            </Text>
            <Text style={styles.aboutBullet}>
              • Chat directly with sellers and buyers
            </Text>
            <Text style={styles.aboutBullet}>
              • Manage your own listings easily
            </Text>
            <Text style={styles.aboutBullet}>
              • Save items to your carton for later
            </Text>

            <Text style={styles.aboutSectionHeader}>Our Mission</Text>

            <Text style={styles.aboutText}>
              We promote sustainable shopping by encouraging reuse and reducing
              waste. By giving items a second life, we help minimize environmental
              impact while making products more accessible to everyone.
            </Text>

            {/* 🔥 NEW SECTION */}
            <Text style={styles.aboutSectionHeader}>About This Project</Text>

            <Text style={styles.aboutText}>
              This application was developed as a school project for the subject{" "}
              <Text style={{ fontWeight: "600" }}>
                [Your Subject Here]
              </Text>{" "}
              under the guidance of{" "}
              <Text style={{ fontWeight: "600" }}>
                [Instructor Name]
              </Text>.
            </Text>

            <Text style={styles.aboutText}>
              The goal of this project is to demonstrate the use of modern mobile
              development technologies, including React Native, Firebase, and UI/UX
              design principles, while solving a real-world problem through a
              functional marketplace platform.
            </Text>

            {/* 🔥 GROUP MEMBERS */}
            <Text style={styles.aboutSectionHeader}>Developers</Text>

            <Text style={styles.aboutBullet}>
              • [Your Name] – Frontend & Backend Development
            </Text>
            <Text style={styles.aboutBullet}>
              • [Member 2] – UI/UX Design
            </Text>
            <Text style={styles.aboutBullet}>
              • [Member 3] – Database & Testing
            </Text>
            <Text style={styles.aboutBullet}>
              • [Member 4] – Documentation
            </Text>

            {/* 🔥 EXTRA TOUCH */}
            <Text style={styles.aboutSectionHeader}>Acknowledgment</Text>

            <Text style={styles.aboutText}>
              We would like to express our gratitude to our instructor and peers
              for their support and guidance throughout the development of this
              project.
            </Text>
          </View>

          <Text style={styles.aboutFooter}>Version 1.0.0</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}