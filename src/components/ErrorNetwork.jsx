import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import SignalWifiConnectedNoInternet4OutlinedIcon from "@mui/icons-material/SignalWifiConnectedNoInternet4Outlined";
export default function ErrorNetwork() {
  const [open, setOpen] = useState(!navigator.onLine);

  useEffect(() => {
    const handleChangeState = () => setOpen(!navigator.onLine);
    window.addEventListener("online", handleChangeState);
    window.addEventListener("offline", handleChangeState);
    return () => {
      window.removeEventListener("online", handleChangeState);
      window.removeEventListener("offline", handleChangeState);
    };
  }, []);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}>
      <Alert
        severity='warning'
        icon={<SignalWifiConnectedNoInternet4OutlinedIcon />}>
        <AlertTitle>Oups, connexion interrompue !</AlertTitle>
        {
          "Il semble que votre appareil ne soit plus connecté à Internet. Assurez-vous que votre réseau fonctionne correctement."
        }
      </Alert>
    </Snackbar>
  );
}
