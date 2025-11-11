import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ListingCard from '../../components/ListingCard';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { CATEGORIES } from '../../constants/categories';
import { Listing } from '../../type/listing';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { img_placeholder } from '../../constants/img_placeholder';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CARD_WIDTH = (screenWidth / 2) - (CARD_MARGIN * 3)

export default function Home() {
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'))

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const d = doc.data() as any;
        return {
          id: doc.id,
          available: d.available ?? true,
          category: d.category || '',
          condition: d.condition || '',
          createdAt: d.createdAt || new Date().toISOString(),
          description: d.description || '',
          images: Array.isArray(d.images) ? d.images : [],
          thumbnail: Array.isArray(d.images) ? d.images[0] : img_placeholder,
          location: d.location || '',
          price: d.price ?? 0,
          sellerId: d.sellerId || '',
          title: d.title || '',
        } as Listing;
      });
      setData(docs);
      setLoading(false);
    }, (err) => {
      console.error('onSnapshot error', err);
      setLoading(false);
    });
  }, []); 

  const filtered = data.filter(d => {
    if (category !== 'All' && d.category !== category) return false;
    if (!searchText) return true;
    return d.title.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search items..."
          style={styles.search}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterContainer}>
          <MaterialIcons name="filter-list" size={30} color='#DC143C' />
          {/* <MaterialCommunityIcons name="filter-menu-outline" size={28} color='#DC143C' /> */}
          {/* <Ionicons name="filter-sharp" size={26} color='#DC143C' /> */}
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.chip, category===item && styles.chipActive]} onPress={() => setCategory(item)}>
            <Text style={[styles.chipText, category===item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        style={{maxHeight: 40}}
        contentContainerStyle={{paddingHorizontal: 12, alignItems: 'center' }}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.feed}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20}}/>
        ) : !filtered ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text>No listings found.</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={{ width: CARD_WIDTH, marginHorizontal: CARD_MARGIN }}>
                <ListingCard item={item} onPress={() => router.push(`/listing/${item.id}`)} />
              </View>
            )}
            numColumns={2}
            style={{borderRadius: 8}}
            contentContainerStyle={{ padding: 8, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

