import { View, Text, StyleSheet, TextInput } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'

const SignIn = () => {
  const {control, handleSubmit, formState: {errors}} = useForm()

  const onSignInPressed = (data) => {
    console.log(data);
    console.warn('onSignInPressed')
  } 

  const onForgotPasswordPressed = () => {
    console.warn('onForgotPasswordPresssed')
    router.push("forgot_password")
  }

  const onGooglePressed = () => {
    console.warn('onGooglePressed')
  }

  const onSignUpPressed = () => {
    console.warn('onSignUpPressed')
    router.replace("sign_up")
  } 

  return (
    <View style={styles.container}>
      <CustomInput
        name="username"
        rules={{required: "This field is required"}}
        placeholder={"Username"} 
        control={control}  
      />
      <CustomInput 
        name="password"
        rules={{required: "This field is required", minLength: {
          value: 3,
          message: "Password should be minimum 3 characters long",
        }}}
        placeholder={"Password"}
        secureTextEntry
        control={control}
      />

      <CustomButton
        text="Sign In"
        onPress={handleSubmit(onSignInPressed)}
      />

      <CustomButton
        text="Forgot password?"
        onPress={onForgotPasswordPressed}
        type="TERTIARY"
      />

      <CustomButton
        text="Continue with Google"
        onPress={onGooglePressed}
        bgColor="#fae9ea"
        fgColor="#dd4d44"
      />

      <CustomButton
        text="Don't have an account yet? Sign Up"
        onPress={onSignUpPressed}
        type="TERTIARY"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  }
})

export default SignIn