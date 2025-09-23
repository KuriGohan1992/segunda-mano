import { Slot, Stack } from "expo-router"


const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle: "Sign In",
        headerShown: true,
      }}/>
      <Stack.Screen name="sign_up" options={{
        headerTitle: "Sign Up",
        headerShown: true,
      }}/>
      <Stack.Screen name="verify_email" options={{
        headerTitle: "Verify Email",
        headerShown: true,
      }}/>
      <Stack.Screen name="forgot_password" options={{
        headerTitle: "Forgot Password",
        headerShown: true,
      }}/>
      <Stack.Screen name="reset_password" options={{
        headerTitle: "Reset Password",
        headerShown: true,
      }}/>
    </Stack>
    
  )
}

export default AuthLayout
