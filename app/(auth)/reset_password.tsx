import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const ResetPassword = () => {
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const onSubmitPressed = () => {
    console.warn('onSubmitPressed')
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
        placeholder={"Verification Code"} 
        value={code} 
        setValue={setCode} 
      />

      <CustomInput 
        placeholder={"New Password"} 
        value={newPassword} 
        setValue={setNewPassword}
        secureTextEntry
      />

      <CustomButton
        text="Submit"
        onPress={onSubmitPressed}
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

export default ResetPassword