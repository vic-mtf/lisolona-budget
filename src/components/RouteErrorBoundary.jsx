import { useRouteError } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { useEffect } from "react";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  useEffect(() => {
    import.meta.env.DEV && console.error(error);
  });
  return (
    <Dialog open>
      <DialogTitle>Oups !</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            color='textPrimary'
            fontWeight='bold'
            component='b'
            variant='body1'>
            G‑Lisolo a cessé de fonctionner à cause d’une erreur sur votre
            appareil.
          </Typography>{" "}
          Des restrictions système, une incompatibilité ou un manque de
          ressources peuvent en être la cause.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => window.location.reload()}
          variant='outlined'
          endIcon={<ReplayOutlinedIcon />}>
          Recharger
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RouteErrorBoundary;
