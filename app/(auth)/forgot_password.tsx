import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { resetPassword } from '../../utils/auth'
const EMAIL_REGEX = /^(?=.{1,64}@)(?:"[^"\\\r\n]+"|[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/

const ForgotPassword = () => {
  const {control, handleSubmit, formState: {errors}} = useForm()
  
  const onSendPressed = async ({ email }) => {
    await resetPassword(email);

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
        rules={{required: "Email is required", pattern: {value: EMAIL_REGEX, message: "Invalid Email"}}}
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