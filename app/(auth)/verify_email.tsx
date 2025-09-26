import { View, Text, StyleSheet, Alert } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { useUser } from '../../context/UserContext'
import { sendEmailVerification } from 'firebase/auth'

const VerifyEmail = () => {
  const { user } = useUser();
  const email = user?.email ?? "your email"
  const {control, handleSubmit, formState: {errors}} = useForm()
  

  const onResendPressed = async () => {
    if (!user) {
      Alert.alert("Error: User is null")
      return;
    } 
    try {
      await sendEmailVerification(user);
      Alert.alert("We've sent a new verification email!")
    } catch (error: any) {
      if (error.code === "auth/too-many-requests") {
        Alert.alert(
          "Too many requests",
          "You've requested too many emails. Please wait a few minutes before trying again."
        );
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
    router.replace("/(auth)")
  }

  return (
    <View style={styles.container}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#051c60',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  email: {
    fontWeight: 'bold',
    color: '#051c60',
  },
  footer: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  link: {
    color: '#fdb075',
    fontWeight: 'bold',
  },
});

export default VerifyEmail