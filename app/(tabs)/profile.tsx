import UnderDevelopment from "../../components/UnderDevelopment";
import { useUser } from "../../context/UserContext";

export default function Profile() {

  const { user, setUser } = useUser();
  return (UnderDevelopment("Profile"))
}