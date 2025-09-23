import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const onSignUpPressed = () => {
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
        placeholder={"Username"} 
        value={username} 
        setValue={setUsername} 
      />
      <CustomInput
        placeholder={"Email"}
        value={email}
        setValue={setEmail}
      />

      <CustomInput 
        placeholder={"Password"} 
        value={password} 
        setValue={setPassword}
        secureTextEntry
      />
      <CustomInput 
        placeholder={"Confirm Password"} 
        value={confirmPassword} 
        setValue={setConfirmPassword}
        secureTextEntry
      />

      <CustomButton
        text="Sign Up"
        onPress={onSignUpPressed}
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