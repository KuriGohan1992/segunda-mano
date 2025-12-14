import { useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, Alert } from "react-native";
import UnderDevelopment from "../../components/UnderDevelopment";
import { useUser } from "../../context/UserContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../(tabs)/styles";


export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [picture, setPicture] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  

  useEffect(() => {
    console.log(id);
    async function getUserDetails() {
      setLoading(true);
      if (id) {
        const docRef = doc(db, 'users', id);
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
  }, [id])

  return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <View style={styles.card}>
        <Text style={styles.title}>{username}'s Profile</Text>
        <Image style={styles.avatar} source={picture ? { uri: picture } : require('../../assets/profile.png')}/>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
    </View>

  )
}

