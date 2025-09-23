import { Tabs } from "expo-router"


const TabsLayout = () => {
  return (
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
  )
}

export default TabsLayout
