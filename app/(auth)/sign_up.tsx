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
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import DropDownPicker from 'react-native-dropdown-picker'
import { ADDRESS } from '@/constants/address'

const EMAIL_REGEX = /^(?=.{1,64}@)(?:"[^"\\\r\n]+"|[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/
const MOBILE_REGEX = /^09\d{9}$/;
const SignUp = () => {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false)
  const {control, handleSubmit, watch, setError, formState: {errors}} = useForm()
  const pwd = watch('password')

  const [address, setAddress] = useState<string | null>(null);
  const [openAddress, setOpenAddress] = useState(false);

  function handleSetOpenAddress(v: boolean) {
    setOpenAddress(v);
  }
  
  const onSignUpPressed = async (data) => {
    
    if (!address) {
      Alert.alert("Error", "Please select an address");
      return;
    }

    if (loading) return;
    setLoading(true);

    const {username, email, password, mobileNumber} = data;

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
        username, email, address, createdAt: serverTimestamp(), carton: [], mobileNumber: mobileNumber || null,
      }, { merge: true });

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

  const onSignInPressed = () => {
    console.warn('onSignInPressed')
    router.replace("/(auth)")
  }

  return (
    <SafeAreaView style={styles.container}>
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

      <View style={{ zIndex: 2, elevation: 2 }}>
        <DropDownPicker
          open={openAddress}
          value={address}
          items={ADDRESS.map((i) => ({ label: i, value: i }))}
          setOpen={handleSetOpenAddress}
          setValue={setAddress}
          placeholder="Select Address"
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          listItemLabelStyle={styles.dropdownInput}
          labelStyle={styles.dropdownInput}
          listItemContainerStyle={styles.listItemContainerStyle}
          dropDownContainerStyle={styles.dropdown}
        />
      </View>

      <CustomInput
        name="password"
        rules={{required: "Password is required"}}
        placeholder={"Password (6+ characters)"}        
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
      <CustomInput
        name="mobileNumber"
        rules={{
          pattern: {
            value: MOBILE_REGEX,
            message: "Enter a valid mobile number (09XXXXXXXXX)",
          },
        }}
        placeholder="Mobile Number (09XXXXXXXXX)"
        keyboardType="numeric"
        control={control}
      />

      <Text style={styles.helperText}>
        Add your GCash/Maya number to enable online payment on listings that you create. You can always change this number in the settings.
      </Text>

      <CustomButton
        text="Sign Up"
        onPress={handleSubmit(onSignUpPressed)}
      />

      {/* <Text style={styles.text}>By creating an account, you confirm that you have read and agree to the{" "}
        <Text style={styles.link} onPress={ onTermsOfUsePressed }>Terms of Use</Text> and{" "} 
        <Text style={styles.link} onPress={ onPrivacyPolicyPressed }>Privacy Policy</Text>
      </Text> */}

      <CustomButton
        text="Already have an account? Sign in"
        onPress={onSignInPressed}
        type="TERTIARY"
      />
    </SafeAreaView>
  )
}


export default SignUp
