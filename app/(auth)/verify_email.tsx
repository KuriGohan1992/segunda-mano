import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const VerifyEmail = () => {
  const [code, setCode] = useState('')
  
  const onVerifyPressed = () => {
    console.warn('onVerifyPressed')
  }

  const onResendPressed = () => {
    console.warn('onResendPressed')
  }

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
    router.dismissAll()
    router.replace("/(auth)")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your Email</Text>
      <CustomInput
        placeholder={"Verification Code"} 
        value={code} 
        setValue={setCode} 
      />

      <CustomButton
        text="Verify"
        onPress={onVerifyPressed}
      />

      <CustomButton
        text="Resend code"
        onPress={onResendPressed}
        type="SECONDARY"
      />

      <CustomButton 
        text="Back to Sign in"
        onPress={onSignInPressed}
        type="TERTIARY"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051c60',
    margin: 10,
  },
})

export default VerifyEmail