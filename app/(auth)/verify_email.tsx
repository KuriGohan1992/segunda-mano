import { View, Text, StyleSheet, Alert } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { useUser } from '../../context/UserContext'
import { sendEmailVerification } from 'firebase/auth'
import { resendVerification } from '../../utils/auth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'

const VerifyEmail = () => {
  const { user } = useUser();
  const email = user?.email ?? "your email"
  const {control, handleSubmit, formState: {errors}} = useForm()
  

  const onResendPressed = async () => {
    if (!user) {
      Alert.alert("Error: User is null")
      return;
    } 
    await resendVerification(user);
  };

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
    router.replace("/(auth)")
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Almost there!</Text>
      <Text style={styles.message}>
        We’ve sent a verification link to your email:{"\n"}
        <Text style={styles.email}>{email}</Text>
        {"\n\n"}
        Please click the link in your inbox to verify your email and complete your account setup.
      </Text>

      <Text style={styles.footer}>
        Didn’t receive it? Check your spam folder, or{" "}
        <Text style={styles.link} onPress={onResendPressed}>
          Resend Email
        </Text>.
      </Text>


      <CustomButton 
        text="Back to Sign in"
        onPress={onSignInPressed}
        type="TERTIARY"
      />
    </SafeAreaView>
  )
}


export default VerifyEmail