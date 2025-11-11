// components/ListingCard.tsx
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Listing } from '../type/listing';

type Props = {
  item: Listing;
  onPress?: (item: Listing) => void;
};

export default function ListingCard({ item, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(item)}>
      <Image source={{ uri: item.thumbnail || 'https://picsum.photos/seed/default/600/400' }} style={styles.image} />
      <View style={styles.meta}>
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <Text style={styles.condition}>{item.condition}</Text>
        <Text style={styles.price}>₱ {Number(item.price || 0).toLocaleString()}</Text>
        <Text style={styles.location}>{item.location || ''}</Text>
      </View>
    </Pressable>
  );
}

function timeAgo(iso?: string) {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    borderWidth: 1,
    borderColor: '#eee',
    paddingBottom: 8,

    
  },
  image: {
    height: 160,
    resizeMode: 'cover'
  },
  meta: {
    flex: 1,
    padding: 10,
    justifyContent: 'center'
  },
  title: { fontSize: 14, fontWeight: '600' },
  price: { marginTop: 4, fontSize: 15, fontWeight: '700', color: '#DC143C' },
  condition: {marginTop: 4, color: '#000', fontSize: 12},
  location: { marginTop: 4, color: '#666', fontSize: 12 }
});