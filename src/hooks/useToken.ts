import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function useToken(): string | null {
  const token = useSelector((store: RootState) => store.user.token);
  return token ? `Bearer ${token}` : null;
}
