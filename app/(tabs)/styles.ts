import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

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
    color: '#DC143C',
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
    width: 100,
    height: 100,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#DC143C',
    backgroundColor: "#fff",
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
    backgroundColor: '#DC143C',
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
  
  FirstBox: {
    width: 100,
    height: 100,
    borderColor: '#e8e8e8',
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  text_image: {
    fontSize: 16,
    color: '#888',
    borderRadius: 5,
    textAlign: 'center'
  },

  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: '#eee',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 14,
  },

  profileHeader: {
    height: 80,
    backgroundColor: '#DC143C',
  },

  menuButton: {
    position: "absolute",
    right: 20,
    bottom: 16,
  },

  cover: {
    height: 140,
    backgroundColor: "black",
  },

  profileSection: {
    alignItems: "center",
    marginTop: -45,
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: '#DC143C',
    borderRadius: 20,
    padding: 6,
  },

  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },

  ratingText: {
    color: "gray",
  },

  tabsContainer: {
    marginTop: 20,
  },

  tabsRow: {
    flexDirection: "row",
  },

  tabItem: {
    width: SCREEN_WIDTH / 3,
    alignItems: "center",
  },

  tabText: {
    fontWeight: "bold",
    color: "#555",
  },

  activeTabText: {
    color: '#DC143C',
  },

  tabLine: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 8,
  },

  tabIndicator: {
    height: 3,
    width: SCREEN_WIDTH / 3,
    backgroundColor: '#DC143C',
  },

  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionHeader: {
    backgroundColor: '#DC143C',
    padding: 8,
    borderRadius: 5,
  },

  sectionHeaderText: {
    color: "#fff",
    fontWeight: "bold",
  },

  label: {
    marginTop: 10,
    color: "gray",
    
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },

  imagePickerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  plusText: {
    fontSize: 30,
  },

  saveButton: {
    width: "100%",
    padding: 10,
    backgroundColor: '#DC143C',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
  },

  cancelButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },

  menuOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
  },

  menuPanel: {
    width: 260,
    backgroundColor: '#DC143C',
    height: "100%",
    padding: 20,
    position: "absolute",
    right: 0,
  },

  menuText: {
    color: "#fff",
    marginVertical: 10,
  },

  menuLogout: {
    color: "#fff",
    marginTop: 20,
  },

  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,

    borderWidth: 1,
    borderColor: "#eee",

    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },

  chatTextContainer: {
    flex: 1,
    justifyContent: "center",
  },

  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
});

export default styles;
