
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Listing } from '../type/listing';
import { img_placeholder } from '../constants/img_placeholder';

type Props = {
  item: Listing;
  onPress?: (item: Listing) => void;
};

export default function ListingCard({ item, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(item)}>
      {(() => {
      const imageUri = item.thumbnail
        ? item.thumbnail.startsWith("http")
          ? item.thumbnail
          : `data:image/jpeg;base64,${item.thumbnail}`
        : img_placeholder;

      console.log(item.type, item.id);

      return (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      );
    })()}
      <View style={styles.meta}>
        <Text numberOfLines={2} style={styles.title}>
          {item.type === "lf" && (
            <Text style={styles.lfTag}>[LF] </Text>
          )}
          {item.title}
        </Text>
        <Text style={styles.condition}>{item.condition}</Text>
        <Text style={styles.price}>₱ {Number(item.price || 0).toLocaleString()}</Text>
        <Text style={styles.location}>{item.location || ''}</Text>
      </View>
    </Pressable>
  );
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
    height: 280,
    borderWidth: 1,
    borderColor: '#eee',    
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
  title: { fontSize: 16, fontWeight: '600' },
  price: { marginTop: 4, fontSize: 16, fontWeight: '700', color: '#DC143C' },
  condition: {marginTop: 4, color: '#000', fontSize: 13},
  location: { marginTop: 8, color: '#666', fontSize: 13 },
  lfTag: {
    color: "#999",      // gray
    fontWeight: "700",  // slightly bold so it still stands out
  },
});