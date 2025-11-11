import { View, Text, StyleSheet, Alert } from 'react-native'
import CustomInput from '../../components/CustomInput'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { useUser } from '../../context/UserContext'

const EMAIL_REGEX = /^(?=.{1,64}@)(?:"[^"\\\r\n]+"|[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/

const SignUp = () => {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false)
  const {control, handleSubmit, watch, setError, formState: {errors}} = useForm()
  const pwd = watch('password')
  
  const onSignUpPressed = async (data) => {
    if (loading) return;
    setLoading(true);

    const {username, email, address, password} = data;

    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("username", {type: "manual", message: "Username is already taken"})
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setUser(user);

      await setDoc(doc(db, "users", user.uid), {
        username, email, address, createdAt: serverTimestamp(),
      });

      await sendEmailVerification(user);
      router.replace("verify_email");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("email", {type: "manual", message: "Email is already in use"});
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
    
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
        rules={{required: "Username is required"}}
        placeholder={"Username"} 
        control={control}
      />
      <CustomInput
        name="email"
        rules={{required: "Email is required", pattern: {value: EMAIL_REGEX, message: "Invalid Email"}}}
        placeholder={"Email"}
        control={control}
      />

      <CustomInput
        name="address"
        rules={{required: "Username is required"}}
        placeholder={"Address"}
        control={control}
      />

      <CustomInput
        name="password"
        rules={{required: "Password is required"}}
        placeholder={"Password"}        
        secureTextEntry
        control={control}
      />
      <CustomInput
        name="confirm_password"
        rules={{required: "Please confirm your password", validate: value => value === pwd || 'Passwords do not match'}}
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
    color: '#fdb075',
    fontWeight: 'bold',
  }
})

export default SignUp