import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },


  search: { 
    backgroundColor: '#fff', 
    width: '78%',
    borderRadius: 8, 
    padding: 12, 
    fontSize: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginRight: 2,
  },

  filterContainer: {
    marginHorizontal: 6,
  },
  chips: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },
  chip: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    marginRight: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    borderWidth: 1,
    borderColor: '#eee',
    paddingBottom: 8,
  },
  chipActive: { backgroundColor: '#DC143C' },
  chipText: { fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  feed: { 
    marginTop: 4,
    marginBottom: -34,
    flex: 1, 
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e3303f',
    marginBottom: 10,
    flexWrap: 'wrap',
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

  placeholderStyle: {color: '#c5c5c7', fontSize: 16,},
  listItemContainerStyle: { height: 45, borderBottomColor: '#e8e8e8', borderBottomWidth: 0.5},

  text: {
    color: 'gray',
    marginVertical: 10,
  },

  link: {
    color: '#fdb075',
    fontWeight: 'bold',
  },

  card: {
    width: "80%",
    alignItems: "center",
    backgroundColor: "#fff",


    paddingTop: 15,
    paddingBottom: 25,
    marginVertical: 10,

    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: '50%',
    margin: 6,
    backgroundColor: "#f0f0f0",
  },
  name: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  address: {
    fontSize: 16,
    color: "#222",
    marginTop: 4,
  },
  email: {
    fontSize: 16,
    color: "#333",
    marginTop: 2,
    marginBottom: 12,
  },

  logoutBtn: {
    backgroundColor: "#E6173B",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  dropdownWrapper: {
    position: "absolute",
    top: 0,
    right: 5,
    width: 200,
    zIndex: 9999,
  },
  dropdownFilter: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderRadius: 8,
    opacity: 0.1,
  },
  dropdownContainer: {
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

});

export default styles