import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  
  const onSendPressed = () => {
    console.warn('onSendPressed')
    router.push("reset_password")
  }

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
    router.dismissAll()
    router.replace("/(auth)")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset your Password</Text>
      <CustomInput
        placeholder={"Email"} 
        value={email} 
        setValue={setEmail} 
      />

      <CustomButton
        text="Send"
        onPress={onSendPressed}
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

export default ForgotPassword