import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSignInPressed = () => {
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
        placeholder={"Username"} 
        value={username} 
        setValue={setUsername} 
      />
      <CustomInput 
        placeholder={"Password"} 
        value={password} 
        setValue={setPassword}
        secureTextEntry
      />

      <CustomButton
        text="Sign In"
        onPress={onSignInPressed}
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