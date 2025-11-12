import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import ListingCard from '../../components/ListingCard';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { CATEGORIES } from '../../constants/categories';
import { Listing } from '../../type/listing';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { img_placeholder } from '../../constants/img_placeholder';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useUser } from '../../context/UserContext';
import CartCard from '../../components/CartCard';

const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CARD_WIDTH = (screenWidth) - (CARD_MARGIN * 4)
const closedWidth = 44; 
const openWidth = 200; 

export default function Carton() {
  const [carton, setCarton] = useState<string[]>([]);
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('All');
  const router = useRouter();
  const { user, setUser } = useUser();
  const uid = user?.uid;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Highest Price First", value: "price_desc" },
    { label: "Lowest Price First", value: "price_asc" },
    { label: "Newest First", value: "date_desc" },
    { label: "Oldest First", value: "date_asc" },
  ]);

  useEffect(() => {
    let q;

    if (value === "price_desc") {
      q = query(collection(db, 'listings'), orderBy('price', 'desc'))
    } else if (value === "price_asc") {
      q = query(collection(db, 'listings'), orderBy('price', 'asc'))
    } else if (value === "date_asc") {
      q = query(collection(db, 'listings'), orderBy('createdAt', 'asc'))
    } else {
      q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'))
    }

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
  }, [value]);

  async function filter() {
    if (uid) {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const u = userSnap.data() as any;
        setCarton(u.carton);
      }
    }
  }  

  const filtered = data.filter(d => {
    if (category !== 'All' && d.category !== category) return false;
    if (!carton.includes(d.id)) return false;
    if (!searchText) return true;
    return d.title.toLowerCase().includes(searchText.toLowerCase());
  });
  console.log(filtered)

  filter();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image style={{width: 40, height: 40}} source={require('../../assets/logo.png')}/>
        <TextInput
          placeholder="Search Carton..."
          style={styles.search}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterContainer}>
          <MaterialIcons name="filter-list" size={32} color='#DC143C' />
          {/* <MaterialCommunityIcons name="filter-menu-outline" size={28} color='#DC143C' /> */}
          {/* <Ionicons name="filter-sharp" size={26} color='#DC143C' /> */}
        </TouchableOpacity>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          showArrowIcon={false}
          containerStyle={{
            position: "absolute",
            top: 0,
            right: 5,
            width: open ? openWidth : closedWidth, 
            zIndex: 1000,
          }}
          style={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 0,         
            opacity: 1,
        
          }}
          dropDownContainerStyle={{
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderRadius: 10,
            marginTop: 0,       
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
          listItemLabelStyle={{ fontSize: 15}}

          placeholder=" "         
          placeholderStyle={{ color: 'transparent' }}
          listItemContainerStyle={{ paddingVertical: 8, }}
          labelStyle={{ color: 'transparent' }}
          />
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
        ) : filtered.length === 0 ? (
          <View style={{  marginTop: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Text>No listings found.</Text>
          </View>
        ) : (
            <FlatList
              data={filtered}
              keyExtractor={i => i.id}
              renderItem={({ item }) => (
                <View style={{ width: CARD_WIDTH, marginHorizontal: CARD_MARGIN }}>
                  <CartCard item={item} onPress={() => router.push(`/listing/${item.id}`)} />
                </View>
              )}
              numColumns={1}
              style={{borderRadius: 8}}
              contentContainerStyle={{ padding: 8, paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            />
        )}
      </View>
    </SafeAreaView>
  );
}

