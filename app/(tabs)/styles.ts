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
    textAlign: "center",
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

  profileSection: {
    alignItems: "center",
    marginTop: -45,
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
    position: "relative",
  },

  tabsRow: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
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
  position: "absolute",
  bottom: 0,
  height: 2,
  backgroundColor: "#DC143C",
  width: "50%",
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

  aboutSectionHeader: {
    color: "#333",
    fontWeight: "bold",
  },

  label: {
    marginTop: 10,
    color: "gray",
    
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
  },

  imageScrollContainer: {
    height: 100,
  },

  imageScrollContent: {
    alignItems: "center",
    paddingHorizontal: 5,
  },

  infoBlock: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  value: {
    marginBottom: 10,
    color: "#333",
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
    paddingTop: 60,
  },

  menuText: {
    color: "#fff",
    marginVertical: 10,
    fontWeight: "700",
  },

  menuTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  menuLogout: {
    color: "#fff",
    marginTop: 20,
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 10,
  },

  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 20,

    width: 56,
    height: 56,
    borderRadius: 28,

    backgroundColor: "#DC143C",
    justifyContent: "center",
    alignItems: "center",

    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  listRowLeft: {
    justifyContent: "flex-start",
  },

  listContent: {
    padding: 8,
    paddingBottom: 80,
  },

  listItemWrapper: {
    flex: 1,
    maxWidth: "50%",
    paddingHorizontal: 4,
    marginBottom: 12,
  },

  BoxTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 6,
    marginBottom: 2,
    marginLeft: 1,
  },

  formContent: {
    padding: 16,
    paddingTop: 80,
  },

  imagePreview: {
    width: "100%",
    height: "100%",
  },

  imageRemoveBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    paddingHorizontal: 5,
  },

  imageRemoveText: {
    color: "#fff",
  },

  imageAddBox: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  listContentWithTop: {
  padding: 8,
  paddingTop: 20,
  paddingBottom: 80,
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
    width: 60,
    height: 60,
    borderRadius: 95,
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },

  chatTextContainer: {
    flex: 1,
    justifyContent: "center",
  },

  username: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },

  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  aboutTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#DC143C",
    marginBottom: 10,
  },

  aboutText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
  },

  aboutBullet: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
    marginLeft: 8,
  },

  aboutFooter: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
    fontSize: 12,
  },

  chatTime: {
    fontSize: 11,
    color: "#888",
    alignSelf: "flex-start",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyImage: {
    width: 260,
    height: 260,
    marginBottom: 20,
    opacity: 0.8,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: "#DC143C",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  emptyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  chatContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  deleteButton: {
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  toggleContainer: {
    flexDirection: "row",
    paddingHorizontal: 2,
    marginBottom: 6,
    marginTop: 12,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
  },

  toggleLeft: {
    marginRight: 6,
  },

  toggleRight: {
    marginLeft: 6,
  },

  toggleActive: {
    backgroundColor: "#ffe5ea",
    borderWidth: 1,
    borderColor: "#DC143C",
  },

  toggleInactive: {
    backgroundColor: "#eee",
  },

  toggleText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },

  toggleTextActive: {
    color: "#DC143C",
  },
  helperText: {
  fontSize: 12,
  color: "#888",
  alignSelf: "flex-start",
  marginBottom: 10,
}

});

export default styles;
