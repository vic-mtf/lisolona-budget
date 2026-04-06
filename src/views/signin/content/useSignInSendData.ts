import { useCallback, useRef, useState } from "react";
import { validateEmail } from "@/utils/validateFields";
import setSignInData from "./setSignInData";

type Step = "userfound" | "useremail" | "password";

interface UseSignInSendDataParams {
  refresh: Function;
  step: Step;
  email: string;
  setEmail: (email: string) => void;
  setStep: (step: Step) => void;
}

export default function useSignInSendData({
  refresh,
  step,
  email,
  setEmail,
  setStep,
}: UseSignInSendDataParams) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleCleanErrorMessage = useCallback(() => {
    if (errorMessage) setErrorMessage(null);
  }, [errorMessage]);

  const getEmail = useCallback(
    () => emailRef.current?.value?.trim() || email,
    [email]
  );

  const handleSendData = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();
      handleCleanErrorMessage();
      const currentEmail = getEmail();
      const password = passwordRef.current?.value;
      let error: string | undefined;

      if (validateEmail(currentEmail)) {
        if (step === "password") {
          if (!password) {
            error = "anyPassword";
          } else {
            try {
              const { data } = await refresh({
                method: "post",
                url: "/api/auth/login",
                data: { email, password },
              });
              setSignInData(data);
            } catch {
              error = "password";
            }
          }
        } else {
          try {
            const { data } = await refresh({
              url: "/api/auth/check",
              data: { type: "email", email: currentEmail },
              method: "post",
            });
            if (data?.found) {
              setEmail(currentEmail);
              setStep("password");
            }
          } catch (e: unknown) {
            error =
              (e as { response?: { data?: { found?: boolean } } })?.response
                ?.data?.found === false
                ? "account"
                : "network";
          }
        }
      } else {
        error = "anyEmail";
      }
      if (error) setErrorMessage(errors[error]);
    },
    [step, email, getEmail, handleCleanErrorMessage, refresh, setEmail, setStep]
  );

  return [
    { errorMessage, emailRef, passwordRef },
    { handleSendData, handleCleanErrorMessage },
  ] as const;
}

const errors: Record<string, string> = {
  anyPassword:
    "Impossible de se connecter, merci de renseigner votre mot de passe.",
  anyEmail:
    "Impossible de se connecter, merci de saisir une adresse e-mail valide.",
  password:
    "Impossible d'ouvrir une session en raison du mot de passe incorrect, vérifiez et réessayez.",
  account:
    "Compte introuvable, cette adresse ne possède pas de compte à la GEID, vérifiez pour essayer à nouveau.",
  network:
    "Un problème est survenu, nous avons des difficultés à charger vos données, vérifiez que vous êtes connecté à internet.",
};
