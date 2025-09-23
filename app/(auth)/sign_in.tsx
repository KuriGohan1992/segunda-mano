import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
  }

  const onForgotPasswordPressed = () => {
    console.warn('onForgotPasswordPresssed')
  }

  const onSignInFacebookPressed = () => {
    console.warn('onSignInFacebookPressed')
  }

  const onSignInGooglePressed = () => {
    console.warn('onSignInGooglePressed')
  }

  const onSignInApplePressed = () => {
    console.warn('onSignInApplePressed')
  }

  const onSignUpPressed = () => {
    console.warn('onSignUpPressed')
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
        text="Sign In with Facebook"
        onPress={onSignInFacebookPressed}
        bgColor="#e7eaf4"
        fgColor="#4765a9"
      />

      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGooglePressed}
        bgColor="#fae9ea"
        fgColor="#dd4d44"
      />

      <CustomButton
        text="Sign In with Apple"
        onPress={onSignInApplePressed}
        bgColor="#e3e3e3"
        fgColor="#363636"
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