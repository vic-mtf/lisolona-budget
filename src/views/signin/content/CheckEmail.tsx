import { TextField, Box, Alert, Fade, Typography } from "@mui/material";
import useCheckTokenAccount from "./useCheckTokenAccount";

type Step = "userfound" | "useremail" | "password";

export default function CheckEmail({
  email,
  errorMessage,
  refresh,
  emailRef,
  user,
  setStep,
}: {
  email: string;
  errorMessage: string | null;
  refresh: Function;
  emailRef: React.RefObject<HTMLInputElement | null>;
  user: Record<string, unknown> | null;
  setStep: (step: Step) => void;
}) {
  return (
    <Box display="flex" flex={1} flexDirection="column">
      <Box display="flex" flex={1} flexDirection="column" width="100%">
        <Typography
          variant="body2"
          align="center"
          color="text.primary"
          paragraph
        >
          Connectez-vous pour accéder à Lisolo. Saisissez l'adresse e-mail
          correspondant à votre compte
        </Typography>
        <TextField
          label="Adresse électronique"
          defaultValue={email}
          fullWidth
          margin="dense"
          inputRef={emailRef}
          error={!!errorMessage}
          autoFocus
        />
        {!!errorMessage && (
          <Alert severity="error">
            <Typography variant="caption">{errorMessage}</Typography>
          </Alert>
        )}
      </Box>
      <Box my={1}>
        <CachedAccount refresh={refresh} user={user} setStep={setStep} />
      </Box>
    </Box>
  );
}

function CachedAccount({
  refresh,
  user,
  setStep,
}: {
  refresh: Function;
  user: Record<string, unknown> | null;
  setStep: (step: Step) => void;
}) {
  const handleCheckAccount = useCheckTokenAccount({
    user: user || {},
    refresh,
  });
  return (
    <Fade in={Boolean(user)} unmountOnExit>
      <Typography color="text.secondary" variant="body2" paragraph>
        Ouvrez une session en tant que{" "}
        <Typography
          component="span"
          variant="body2"
          fontWeight="bold"
          color="primary.main"
          sx={{ cursor: "pointer" }}
          onClick={handleCheckAccount}
        >
          {(user?.email as string) || ""}
        </Typography>
      </Typography>
    </Fade>
  );
}
