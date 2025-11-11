import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'

const ResetPassword = () => {
  const {control, handleSubmit, formState: {errors}} = useForm()
  
  const onSubmitPressed = (data) => {
    console.warn('onSubmitPressed')
  }

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
    router.dismissAll()
    router.replace("/(auth)")
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset your Password</Text>
      <CustomInput
        name="verification"
        rules={{required: "This field is required"}}
        placeholder={"Verification Code"} 
        control={control}
      />

      <CustomInput
        name="new_password"
        rules={{required: "This field is required"}}
        placeholder={"New Password"}        
        secureTextEntry
        control={control}
      />

      <CustomButton
        text="Submit"
        onPress={handleSubmit(onSubmitPressed)}
      />

      <CustomButton 
        text="Back to Sign in"
        onPress={onSignInPressed}
        type="TERTIARY"
      />
    </SafeAreaView>
  )
}



export default ResetPassword