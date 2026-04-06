import { useCallback } from "react";
import setSignInData from "./setSignInData";
import { encrypt } from "@/utils/crypt";

export default function useCheckTokenAccount({
  user,
  refresh,
}: {
  user: Record<string, unknown>;
  refresh: Function;
}) {
  const handleCheckAccount = useCallback(() => {
    const { token } = user;
    refresh({
      url: "/api/auth/check",
      method: "post",
      data: { type: "token", token },
    })
      .then(({ data }: { data: { found: boolean } }) => {
        if (data?.found) setSignInData(encrypt(user));
      })
      .catch(() => {
        // Token invalide, l'utilisateur devra se reconnecter manuellement
      });
  }, [user, refresh]);
  return handleCheckAccount;
}
