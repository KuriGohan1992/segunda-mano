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

  dropdown: {
    backgroundColor: 'white',
    width: '100%',

    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    paddingHorizontal: 12,

  },

  dropdownInput: {
    fontSize: 16,
    color: '#333',
  }, 

  placeholderStyle: {
    color: '#c5c5c7', fontSize: 16,
  },

  listItemContainerStyle: { 
    height: 45, borderBottomColor: '#e8e8e8', borderBottomWidth: 0.5
  },
  helperText: {
    fontSize: 12,
    color: "#888",
    alignSelf: "flex-start",
    marginBottom: 10,
  }
})

export default styles