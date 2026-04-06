import { useMemo, useEffect, useState, useCallback } from "react";
import { Slide, Stack, Box, Button } from "@mui/material";
import Account from "./Account";
import { useSelector } from "react-redux";
import CheckEmail from "./CheckEmail";
import CheckPassword from "./CheckPassword";
import { decrypt } from "@/utils/crypt";
import useSignInSendData from "./useSignInSendData";
import type { RootState } from "@/redux/store";

type Step = "userfound" | "useremail" | "password";

export default function Content({
  loading,
  refresh,
}: {
  loading: boolean;
  refresh: Function;
}) {
  const appStoreUser = useSelector((store: RootState) => store.app.user);
  const user = useMemo(
    () => (appStoreUser?.data ? decrypt(appStoreUser.data as string) : null),
    [appStoreUser]
  ) as Record<string, unknown> | null;

  const [step, setStep] = useState<Step>(() =>
    user ? "userfound" : "useremail"
  );
  const [email, setEmail] = useState("");

  const [
    { errorMessage, emailRef, passwordRef },
    { handleSendData, handleCleanErrorMessage },
  ] = useSignInSendData({
    refresh,
    step,
    email,
    setEmail,
    setStep,
  });

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      component="form"
      onSubmit={handleSendData}
      height="100%"
      width="100%"
    >
      <Box flex={1} position="relative" display="flex" flexDirection="column">
        <TabLevel show={step === "userfound"}>
          <Account user={user || {}} refresh={refresh} setStep={setStep} />
        </TabLevel>
        <TabLevel show={step === "useremail"}>
          <CheckEmail
            email={email}
            errorMessage={errorMessage}
            refresh={refresh}
            user={user}
            emailRef={emailRef}
            setStep={setStep}
          />
        </TabLevel>
        <TabLevel show={step === "password"}>
          <CheckPassword
            email={email}
            passwordRef={passwordRef}
            errorMessage={errorMessage}
            setStep={setStep}
          />
        </TabLevel>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          variant="outlined"
          size="small"
          disabled={loading}
        >
          {step === "password" ? "Connexion" : "Suivant"}
        </Button>
      </Box>
    </Box>
  );
}

function TabLevel({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <Slide
      in={show}
      direction="right"
      style={{ position: "absolute", top: 0 }}
      unmountOnExit
    >
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        width="100%"
        height="100%"
      >
        {children}
      </Box>
    </Slide>
  );
}
