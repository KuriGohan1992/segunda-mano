import { Slot, Stack } from "expo-router"


const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle: "Sign In",
        headerShown: false,
      }}/>
      <Stack.Screen name="sign_up" options={{
        headerTitle: "Sign Up",
        headerShown: false,
      }}/>
      <Stack.Screen name="verify_email" options={{
        headerTitle: "Verify Email",
        headerShown: false,
      }}/>
      <Stack.Screen name="forgot_password" options={{
        headerTitle: "Forgot Password",
        headerShown: false,
      }}/>
      <Stack.Screen name="reset_password" options={{
        headerTitle: "Reset Password",
        headerShown: false,
      }}/>
    </Stack>
    
  )
}

export default AuthLayout
