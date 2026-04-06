import {
  TextField,
  Box,
  Alert,
  Chip,
  Avatar,
  FormControlLabel,
  Checkbox,
  FormControl,
  Typography,
} from "@mui/material";
import { useState } from "react";

type Step = "userfound" | "useremail" | "password";

export default function CheckPassword({
  passwordRef,
  email,
  errorMessage,
  setStep,
}: {
  passwordRef: React.RefObject<HTMLInputElement | null>;
  email: string;
  errorMessage: string | null;
  setStep: (step: Step) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <Box display="flex" flex={1} flexDirection="column">
      <Box display="flex" flex={1} flexDirection="column" width="100%">
        <Box textAlign="center">
          <Typography color="text.primary" align="center" variant="body1">
            Bienvenue
          </Typography>
          <Chip
            avatar={<Avatar variant="rounded" />}
            onClick={() => setStep("useremail")}
            label={email}
            sx={{ borderRadius: 1, cursor: "pointer" }}
          />
        </Box>
        <TextField
          label="Mot de passe"
          defaultValue=""
          fullWidth
          margin="dense"
          inputRef={passwordRef}
          type={show ? "text" : "password"}
          onPaste={(event) => event.preventDefault()}
          error={!!errorMessage}
          autoFocus
        />
        <Box justifyContent="right" display="flex">
          <Typography
            variant="body2"
            fontWeight="bold"
            color="primary.main"
            sx={{ cursor: "pointer" }}
          >
            Mot de passe oublié ?
          </Typography>
        </Box>
        <FormControl sx={{ display: "inline-block" }}>
          <FormControlLabel
            value="left"
            control={<Checkbox size="small" />}
            label={
              <Typography variant="body2" component="div" color="text.primary">
                Afficher le mot de passe
              </Typography>
            }
            labelPlacement="end"
            onChange={(_e, val) => setShow(val)}
          />
        </FormControl>
        {!!errorMessage && (
          <Alert severity="error">
            <Typography variant="caption">{errorMessage}</Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
}
