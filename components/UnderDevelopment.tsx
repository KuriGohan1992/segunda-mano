import { Image, Text, View, StyleSheet, Dimensions } from "react-native";


export default function UnderDevelopment() {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('../assets/under-dev.png')}/>
            <Text style={styles.title}>Page Under Construction</Text>
            <Text style={styles.subtitle}>
                We’re still polishing this feature — check back soon!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('window').width / 1.3,
    height: Dimensions.get('window').width / 1.3,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC143C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
})
  