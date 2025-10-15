import { Tabs } from "expo-router"
import { UserProvider } from "../../context/UserContext"


const TabsLayout = () => {
  return (
    <UserProvider>
      <Tabs>
        <Tabs.Screen name="index" options={{
          headerTitle: "Home",
          headerShown: false,
          title: "Home",
        }}/>
        <Tabs.Screen name="users/[id]" options={{
          headerTitle: "User Page",
          headerShown: false,
          title: "User",
        }}/>
      </Tabs>
    </UserProvider>
  )
}

export default TabsLayout
