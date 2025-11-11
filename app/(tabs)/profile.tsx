import { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, Alert } from "react-native";
import UnderDevelopment from "../../components/UnderDevelopment";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./styles";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser();
  const uid = user?.uid;
  const email = user?.email;
  const [picture, setPicture] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  

  useEffect(() => {   
    async function getUserDetails() {
      setLoading(true);
      if (uid) {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const d = docSnap.data() as any;
          setUsername(d.username);
          setAddress(d.address);
          if (d.picture) {
            setPicture(d.picture);
          } 
        }
      } 
      setLoading(false);

    }
    getUserDetails();
  }, [uid])

  return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <View style={styles.card}>
        <Text style={styles.title}>{username}'s Profile</Text>
        <Image style={styles.avatar} source={picture ? { uri: picture } : require('../../assets/profile.png')}/>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.address}>{address}</Text>
        <Text style={styles.email}>{email}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => {
          Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Log Out",
              style: "destructive",
              onPress: () => {
                router.replace('../(auth)')
              }
            }
          ], {cancelable: true})
        }}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
}

