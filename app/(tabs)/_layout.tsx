import { Tabs } from "expo-router"
import { UserProvider } from "../../context/UserContext"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabsLayout = () => {
  return (
    <UserProvider>
      <Tabs 
        screenOptions={{
          tabBarActiveTintColor: '#DC143C',
          tabBarStyle: {
            height: 80,
          }
        }}
        safeAreaInsets={{ bottom: 0 }}>
          
        <Tabs.Screen name="index" options={{
          headerTitle: "Home",
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color}/>,
        }}/>
        <Tabs.Screen name="sell" options={{
          headerTitle: "Sell",
          headerShown: false,
          title: "Sell",
          tabBarIcon: ({ color }) => <Ionicons name="pricetags" size={23} color={color} />,
        }}/>
        <Tabs.Screen name="profile" options={{
          headerTitle: "Profile",
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons size={25} name="person-sharp" color={color}/>,
        }}/>
        <Tabs.Screen name="carton" options={{
          headerTitle: "Carton",
          headerShown: false,
          title: "Carton",
          tabBarIcon: ({ color }) => <FontAwesome5 size={21} name="box-open" color={color}/>,
        }}/>
        <Tabs.Screen name="chats" options={{
          headerTitle: "Chats",
          headerShown: false,
          title: "Chats",
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color}/>,
        }}/>

        <Tabs.Screen name="styles" options={{
          headerTitle: "Styles",
          headerShown: false,
          title: "Styles",
          href: null,
        }}/>

      </Tabs>
    </UserProvider>
  )
}

export default TabsLayout
