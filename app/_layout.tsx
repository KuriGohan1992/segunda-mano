import { Slot, Stack } from "expo-router"
import { UserProvider } from "../context/UserContext"
import { SafeAreaView } from "react-native-safe-area-context"

const RootLayout = () => {
  return (

      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false
          }}
          >
          <Stack.Screen name="(auth)/index" options={{
            headerTitle: "Sign In",
            headerShown: false,
          }}/>
          <Stack.Screen name="(auth)/sign_up" options={{
            headerTitle: "Sign Up",
            headerShown: false,
          }}/>
          <Stack.Screen name="(auth)/verify_email" options={{
            headerTitle: "Verify Email",
            headerShown: false,
          }}/>
          <Stack.Screen name="(auth)/forgot_password" options={{
            headerTitle: "Forgot Password",
            headerShown: false,
          }}/>
          <Stack.Screen name="(auth)/reset_password" options={{
            headerTitle: "Reset Password",
            headerShown: false,
          }}/>
        </Stack>
      </UserProvider>

    
  )
}

export default RootLayout
