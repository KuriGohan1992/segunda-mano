import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'

const ForgotPassword = () => {
  const {control, handleSubmit, formState: {errors}} = useForm()
  
  const onSendPressed = (data) => {
    console.log(data);
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
        name="email"
        rules={{required: "This field is required"}}
        placeholder={"Email"} 
        control={control}
      />

      <CustomButton
        text="Send"
        onPress={handleSubmit(onSendPressed)}
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