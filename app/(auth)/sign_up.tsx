import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'

const EMAIL_REGEX = /^(?=.{1,64}@)(?:"[^"\\\r\n]+"|[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/

const SignUp = () => {
  const {control, handleSubmit, watch, formState: {errors}} = useForm()
  const pwd = watch('password')
  
  const onSignUpPressed = (data) => {
    console.log(data)
    console.warn('onSignUpPressed')
    router.push("verify_email")
  }
  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed')
  }

  const onPrivacyPolicyPressed = () => {
    console.warn('onPrivacyPolicyPressed')
  }

  const onGooglePressed = () => {
    console.warn('onGooglePressed')
  }

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
    router.replace("/(auth)")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>
      <CustomInput
        name="username"
        rules={{required: "This field is required"}}
        placeholder={"Username"} 
        control={control}
      />
      <CustomInput
        name="email"
        rules={{required: "This field is required", pattern: {value: EMAIL_REGEX, message: "Invalid Email"}}}
        placeholder={"Email"}
        control={control}
      />

      <CustomInput
        name="password"
        rules={{required: "This field is required"}}
        placeholder={"Password"}        
        secureTextEntry
        control={control}
      />
      <CustomInput
        name="confirm_password"
        rules={{required: "This field is required", validate: value => value === pwd || 'Passwords do not match'}}
        placeholder={"Confirm Password"} 
        secureTextEntry
        control={control}
      />

      <CustomButton
        text="Sign Up"
        onPress={handleSubmit(onSignUpPressed)}
      />

      <Text style={styles.text}>By creating an account, you confirm that you have read and agree to the{" "}
        <Text style={styles.link} onPress={ onTermsOfUsePressed }>Terms of Use</Text> and{" "} 
        <Text style={styles.link} onPress={ onPrivacyPolicyPressed }>Privacy Policy</Text>
      </Text>

      <CustomButton
        text="Continue with Google"
        onPress={onGooglePressed}
        bgColor="#fae9ea"
        fgColor="#dd4d44"
      />

      <CustomButton
        text="Already have an account? Sign in"
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

  text: {
    color: 'gray',
    marginVertical: 10,
  },

  link: {
    color: '#fdb075'
  }
})

export default SignUp