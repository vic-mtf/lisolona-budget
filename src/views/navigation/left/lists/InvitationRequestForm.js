import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Box as MuiBox,
} from "@mui/material";
import React, { useRef, useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Button from "../../../../components/Button";
import InputController from "../../../../components/InputController";
import { LoadingButton } from "@mui/lab";
import useAxios from "../../../../utils/useAxios";
import { useSelector } from "react-redux";
import useCustomSnackbar from "../../../../components/useCustomSnackbar";
import IconButton from "../../../../components/IconButton";

export default function InvitationRequestForm({ open, onClose }) {
  const [externalError, setExternalError] = useState(false);
  const { enqueueCustomSnackbar, closeCustomSnackbar } = useCustomSnackbar();
  const token = useSelector((store) => store?.user?.token);
  const [{ loading }, refetch] = useAxios(
    {
      method: "post",
      url: "/api/chat/invite",
      headers: { Authorization: `Bearer ${token}` },
    },
    { manual: true }
  );
  const emailRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const targetMail = emailRef.current;

    if (targetMail && externalError) setExternalError(false);
    if (!targetMail && !externalError) setExternalError(true);
    if (targetMail) {
      const data = { targetMail, object: "connexion" };
      const alert = {};
      try {
        await refetch({ data });
        alert.message = getMessages(emailRef.current).success;
        alert.severity = "success";
      } catch (e) {
        const status = e?.response?.status;
        switch (status) {
          case 404:
            alert.message = getMessages(emailRef.current).warning404;
            alert.severity = "warning";
            break;
          case 409:
            alert.message = getMessages(emailRef.current).warning409;
            alert.severity = "warning";
            break;
          default:
            alert.message = getMessages(emailRef.current).error;
            alert.severity = "error";
        }
      }
      onClose();
      const { message, severity } = alert;
      let key;
      const getKey = (_key) => (key = _key);
      enqueueCustomSnackbar({
        message,
        severity,
        getKey,
        action: (
          <IconButton onClick={() => closeCustomSnackbar(key)}>
            <CloseOutlinedIcon />
          </IconButton>
        ),
      });
    }
  };

  return (
    <Dialog
      open={Boolean(open)}
      BackdropProps={{
        sx: {
          bgcolor: (theme) =>
            theme.palette.background.paper + theme.customOptions.opacity,
          backdropFilter: (theme) => `blur(${theme.customOptions.blur})`,
        },
      }}
      PaperProps={{
        sx: { maxWidth: 500 },
        onSubmit: handleSubmit,
        component: "form",
      }}>
      <DialogTitle variant='h6' fontSize={18} fontWeight='bold'>
        Inviter un contact
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant='body2' component='div' paragraph>
          Pour initier une connexion avec un contact, il est conseillé d'envoyer
          une invitation par courrier électronique. Afin de garantir que la
          connexion soit établie sur la plateforme GEID, il est important de
          s'assurer que le contact dispose d'un compte reconnu par cette
          plateforme.
        </DialogContentText>
        <MuiBox>
          <InputController
            type='email'
            valueRef={emailRef}
            margin='dense'
            externalError={externalError}
            autoController
            fullWidth>
            <TextField label='Adresse électronique' />
          </InputController>
        </MuiBox>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          {" "}
          Annuler{" "}
        </Button>
        <LoadingButton
          color='primary'
          variant='outlined'
          type='submit'
          size='small'
          sx={{ textTransform: "none" }}
          loading={loading}>
          {" "}
          Soumettre l'invitation
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

const getMessages = (email) => ({
  success: `
    L'invitation est envoyée avec succès, "${email}" sera avisé 
    de la demande de confirmation d'être en contact avec vous.`,
  warning404: `
    Désolé, "${email}" n'a pas été trouvé. Veuillez vérifier l'adresse e-mail et réessayer.`,
  warning409: `Invitation impossible pour le moment. 
    Demande en attente ou déjà acceptée. Attendez la réponse pour voir "${email}" 
    dans vos contacts.`,
  error: `Impossibilité de soumettre cette invitation en raison d'un problème 
    résultant d'une mauvaise tentation ou d'une manipulation inappropriée.`,
});
