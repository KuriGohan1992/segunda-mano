import { sendEmailVerification, sendPasswordResetEmail, User } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../firebase";

export const resendVerification = async (user: User) => {
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
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert("Password Reset Email Sent!", `Check your inbox: ${email}`);
  } catch (error: any) {
    switch (error.code) {
      case "auth/user-not-found":
        Alert.alert("No user found with this email.");
        break;
      case "auth/invalid-email":
        Alert.alert("Invalid email address.");
        break;
      case "auth/too-many-requests":
        Alert.alert(
          "Too many requests",
          "You've requested too many password resets. Please wait a few minutes."
        );
        break;
      default:
        Alert.alert("Error", error.message);
    }
  }
}