import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    padding: 20,
  },

  logo: {
    width: '80%',
    maxWidth: 300,
    height: 100,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e3303f',
    marginBottom: 10,
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  email: {
    fontWeight: 'bold',
    color: '#DC143C',
  },
  footer: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  text: {
    color: 'gray',
    marginVertical: 10,
  },

  link: {
    color: '#fdb075',
    fontWeight: 'bold',
  },
})

export default styles