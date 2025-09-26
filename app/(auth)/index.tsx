import { View, Text, StyleSheet, TextInput, Image, useWindowDimensions, Alert } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import Logo from '../../assets/icon.png'
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const {control, handleSubmit, setError, formState: {errors}} = useForm()
  const {height} = useWindowDimensions();

  const onSignInPressed = async (data) => {
    try {
      if (loading) return;
      setLoading(true);
      const { email, password } = data;

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        router.replace({
          pathname: "verify_email",
          params: { email },
        });
        return;
      }

      router.replace("../(tabs)")
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("email", {type: "manual", message: "No user found with this email"});
          break;
        case "auth/wrong-password":
          setError("password", {type: "manual", message: "Incorrect password"});
          break;
        default:
          Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
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
      <Image source={Logo} style={[styles.logo, {height: height * 0.4}]} resizeMode="contain"/>
      <CustomInput
        name="email"
        rules={{required: "Email is required"}}
        placeholder={"Email"}
        control={control}
      />
      <CustomInput 
        name="password"
        rules={{required: "Password is required", minLength: {
          value: 3,
          message: "Password should be minimum 3 characters long",
        }}}
        placeholder={"Password"}
        secureTextEntry
        control={control}
      />

      <CustomButton
        text="Sign In"
        loading={loading}
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
  },

  logo: {
    width: '80%',
    maxWidth: 300,
    height: 100,
  }
})

export default SignIn