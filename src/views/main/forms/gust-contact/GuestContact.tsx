import React, { useCallback } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  IconButton,
  DialogActions,
  Button,
  Box,
  Typography,
  Toolbar,
  Stack,
  TextField,
  Fade,
  FormHelperText,
  Alert,
  AlertTitle,
} from "@mui/material";
import LinearProgressLayer from "@/components/LinearProgressLayer";
import useAxios from "@/hooks/useAxios";
import useToken from "@/hooks/useToken";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import { useForm } from "react-hook-form";
import { useNotifications } from "@toolpad/core/useNotifications";

const GuestContact = ({ onClose }) => {
  const Authorization = useToken();
  const notifications = useNotifications();
  const [error, setError] = React.useState(null);
  const [{ loading }, refresh] = useAxios(
    {
      method: "POST",
      url: "/api/chat/invite",
      headers: { Authorization },
    },
    { manual: true }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = useCallback(
    async ({ targetMail }) => {
      const data = { targetMail, object: "connexion" };
      try {
        await refresh({ data });
        notifications.show(
          <>
            <AlertTitle>Invitation envoyée</AlertTitle>
            {"Le destinataire a bien reçu l'invitation"}
          </>,
          {
            severity: "success",
          }
        );
        if (error) setError(null);
        onClose();
      } catch (e) {
        console.error(e);
        setError(e);
      }
    },
    [refresh, error, onClose, notifications]
  );

  return (
    <>
      <LinearProgressLayer open={loading} />
      <Box
        component='form'
        overflow='hidden'
        height='100%'
        width='100%'
        display='flex'
        flexDirection='column'
        autoFocus={!loading}
        onSubmit={handleSubmit(onSubmit)}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onClose}
            aria-label='close'
            disabled={loading}>
            <CloseOutlinedIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Inviter un contact
          </Typography>
        </Toolbar>
        <Box
          overflow='hidden'
          position='relative'
          minHeight={{ md: 300 }}
          flex={1}
          width={{ md: 450, xs: "100%" }}>
          <Stack p={2} spacing={4}>
            <Typography flexGrow={1} color='text.secondary'>
              {`Ajout de contact Pour établir une connexion, 
              envoyez une invitation à votre contact via son adresse électronique. 
              Dès qu'il aura accepté votre demande, vous pourrez échanger librement.
              Assurez-vous que votre interlocuteur possède un compte actif sur la plateforme GEID`}
            </Typography>
            <Box>
              <TextField
                name='targetMail'
                label='Adresse électronique'
                color={errors?.targetMail ? "error" : "primary"}
                type='email'
                fullWidth
                {...register("targetMail", {
                  required: "Saisissez l'adresse mail du contact",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Entrez une adresse mail valide",
                  },
                })}
              />
              <Fade in={Boolean(errors?.targetMail)} unmountOnExit>
                <FormHelperText sx={{ color: "error.main", height: 15 }}>
                  {errors?.targetMail?.message}
                </FormHelperText>
              </Fade>
            </Box>
            <Fade in={Boolean(error)} unmountOnExit>
              <Alert severity='error'>
                <AlertTitle>{getErrorTitle(error?.status)}</AlertTitle>
                {getErrorMessage(error?.status)}
              </Alert>
            </Fade>
          </Stack>
        </Box>
        <DialogActions>
          <Button
            variant='outlined'
            disabled={loading}
            type='submit'
            endIcon={<ForwardToInboxOutlinedIcon />}>
            Envoyer
          </Button>
        </DialogActions>
      </Box>
    </>
  );
};

const getErrorTitle = (status) => {
  switch (status) {
    case 404:
      return "Destinataire introuvable";
    case 500:
      return "Erreur interne du serveur";
    case 409:
      return "Conflit détecté";
    case 0:
      return "Erreur réseau";
    default:
      return "Une erreur est survenue";
  }
};

const getErrorMessage = (status) => {
  switch (status) {
    case 404:
      return "L'utilisateur que vous tentez de contacter n'existe pas ou n'est plus disponible.";
    case 500:
      return "Nous avons rencontré un problème sur le serveur. Veuillez réessayer plus tard.";
    case 409:
      return "Une invitation est déjà en attente. Vous serez mis en contact dès son acceptation ou ce contact est déjà enregistré dans votre liste";
    case 0:
      return "La connexion au serveur semble avoir échoué. Vérifiez votre réseau et réessayez.";
    default:
      return "Une erreur inattendue est survenue. Merci de réessayer dans quelques instants.";
  }
};

export default React.memo(GuestContact);
