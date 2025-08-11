import { useSelector } from "react-redux";

export default function useToken() {
  const token = useSelector((store) => store.user.token);
  return token ? `Bearer ${token}` : null;
}
