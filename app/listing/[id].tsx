import React, { useEffect, useState } from 'react';
import { Image, View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Button, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Listing } from '../../type/listing';
import Ionicons from '@expo/vector-icons/Ionicons';
import { img_placeholder } from '../../constants/img_placeholder';
import { useUser } from '../../context/UserContext';


export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [seller, setSeller] = useState<string | null>('');
  const [picture, setPicture] = useState<string | null>('');
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState(false);

  const { user, setUser } = useUser();
  const uid = user?.uid;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchListing() {
      setLoading(true);
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        setListing(null);
      } else {
        const d = docSnap.data() as any;

        const fetchedListing: Listing = {
          id: docSnap.id,
          available: d.available ?? true,
          category: d.category || '',
          condition: d.condition || '',
          createdAt: (new Date((d.createdAt.seconds) * 1000)).toDateString().slice(4) || new Date().toISOString(),
          description: d.description || '',
          images: Array.isArray(d.images) ? d.images : [],
          thumbnail: Array.isArray(d.images) ? d.images[0] : img_placeholder,
          location: d.location || '',
          price: d.price ?? 0,
          sellerId: d.sellerId || '',
          title: d.title || '',
        };
        setListing(fetchedListing);

        if (uid) {
          const userRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const u = userSnap.data() as any;
            setInCart(u.carton.includes(id));
          }

        }



        if (fetchedListing.sellerId) {
          const sellerRef = doc(db, 'users', fetchedListing.sellerId);
          const sellerSnap = await getDoc(sellerRef);

          if (sellerSnap.exists()) {
            const d = sellerSnap.data() as any;
            setSeller(d.username);
            setPicture(d.picture);
          } else {
            setSeller(null);
          }
        }
      }
      setLoading(false);
    }
    fetchListing();
    return;
  
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loading} size="large" />
      </View>
    );
  }
  if (!listing) {
    return (
      <View style={styles.container}>
        <Text>Listing not found.</Text>
      </View>
    );
  }

  return (
    <>
    <TouchableOpacity style={styles.arrow} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={28} color="#FAFAFA" style={styles.arrowIcon} />
    </TouchableOpacity>
    <ScrollView style={styles.container}>
      <Image source={{ uri: listing.thumbnail || img_placeholder }} style={styles.image} />
      <View style={{ padding: 12 }}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>₱ {Number(listing.price).toLocaleString()}</Text>
        <Text style={styles.field}>Condition: <Text style={{ fontWeight: 400 }}>{listing.condition}</Text></Text>
        <Text style={styles.field}>Description: </Text>
        <Text style={styles.desc}>{listing.description}</Text>
        <Text style={styles.field}>Seller:</Text>
        <View style={{flexDirection: 'row'}}>
          <Image style={{ margin: 4, width: 50, height: 50, borderRadius: '50%' }} source={ picture ? { uri: picture } : require('../../assets/profile.png') }/>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.seller}>{seller || 'Unknown'}</Text>
            <Text style={[styles.seller, {fontWeight: 400}]}>{listing.location || 'Unknown'}</Text>
          </View>
        </View>
      </View>


    </ScrollView>
    <View style={styles.footer}>
      <TouchableOpacity style={styles.action} onPress={() => router.push('../(tabs)/chats')}>
        <Ionicons name="chatbubble-ellipses" size={26} color='#DC143C'/>
        <Text style={styles.label}>
          Chat with Seller    
        </Text>
      </TouchableOpacity>
      <View style={styles.divider}></View>
      <TouchableOpacity style={styles.action} onPress={async () => {
        if (loading) return;
        setLoading(true);
        if (uid) {
          if (inCart) {
            setInCart(false);
            await updateDoc(doc(db, 'users', uid), {
              carton: arrayRemove(id)
            })
            Alert.alert('Item Removed', 'This item has been removed from your Carton');
          } else {
            setInCart(true);
            await updateDoc(doc(db, 'users', uid), {
              carton: arrayUnion(id)
            })
            Alert.alert('Item Added', 'This item has been added to your Carton');
          }
        }
        setLoading(false);
      }}>
        <FontAwesome5 size={21} name="box-open" color='#DC143C'/>
        { inCart ? 
        <Text style={styles.label}>
          Remove Item
        </Text> :         
        <Text style={styles.label}>
          Add to Carton
        </Text> 
        }
      </TouchableOpacity>
      <View style={styles.divider}></View>
      <TouchableOpacity style={styles.primary}>
        <FontAwesome5 name="box" size={21} color="#fff" />
        <View>
          <Text style={styles.primaryText}>
            Box it Now
          </Text>
          <Text style={styles.primaryText}>
            ₱ {Number(listing.price).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  image: { width: '100%', height: 420, resizeMode: 'cover' },
  title: { fontSize: 20, fontWeight: '700' },
  field: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 4, color: '#555' },
  price: { fontSize: 18, fontWeight: '800', color: '#DC143C', marginTop: 6 },
  desc: { marginLeft: 12, fontSize:16, color: '#444', lineHeight: 24},
  seller: { marginLeft: 8, marginTop: 4, fontSize: 15, color: '#333', fontWeight: '600' },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  arrowIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowRadius: 3,
  },
  footer: {
    
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    height: 80,
    flexDirection: "row",
    alignItems: 'flex-end',
    justifyContent: 'flex-start',


  },

  divider: {
    width: 1,
    backgroundColor: '#ddd',
    height: '40%',
    marginBottom: 36,
  }, 
  action: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },

  primary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC143C",
    paddingHorizontal: 18,
    marginLeft: 20,
    marginBottom: 24,
    paddingVertical: 8,
    borderRadius: 8,

  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 8,
  },
});