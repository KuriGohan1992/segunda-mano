import React, { useEffect, useState } from 'react';
import { Image, View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Listing } from '../../type/listing';


export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);  

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
        setListing({
          id: docSnap.id,
          available: d.available ?? true,
          category: d.category || '',
          condition: d.condition || '',
          createdAt: d.createdAt || new Date().toISOString(),
          description: d.description || '',
          // images: Array.isArray(d.images) ? d.images : [],
          thumbnail: d.thumbnail || 'https://picsum.photos/seed/default/600/400',
          location: d.location || '',
          price: d.price ?? 0,
          sellerId: d.sellerId || '',
          title: d.title || '',
        } as Listing);
      }

      setLoading(false);
    }
    fetchListing();
    return;
  
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
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
    <View style={styles.container}>
      <Image source={{ uri: listing.thumbnail || 'https://picsum.photos/seed/default/800/600' }} style={styles.image} />
      <View style={{ padding: 12 }}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.price}>₱ {Number(listing.price).toLocaleString()}</Text>
        <Text style={styles.desc}>{listing.description}</Text>
        <Text style={styles.seller}>Seller: {listing.sellerId || 'Unknown'}</Text>

        <View style={{ marginTop: 12 }}>
          <Button title="Chat with Seller" onPress={() => router.push(`/chat/${listing.sellerId}_${/*buyerId*/'ME'}`)} />
          <View style={{ height: 8 }} />
          <Button title="Add to Cart" onPress={() => {/* TODO: add to cart logic */}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  image: { width: '100%', height: 380, resizeMode: 'cover' },
  title: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  price: { fontSize: 16, fontWeight: '800', color: '#DC143C', marginTop: 6 },
  desc: { marginTop: 8, color: '#444' },
  seller: { marginTop: 12, color: '#333', fontWeight: '600' }
});