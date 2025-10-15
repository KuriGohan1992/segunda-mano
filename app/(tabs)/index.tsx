import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useUser } from "../../context/UserContext";

const HomePage = () => {
  const { user, setUser } = useUser();
  const email = user?.email;
  const uid = user?.uid;
  return (
    <View>
      <Text>Home Page</Text>
      <Text>Hello { email } A.K.A. your ID is { uid }</Text>
      <Link href="../(auth)">Log out</Link>
    </View>
  );
};

export default HomePage;