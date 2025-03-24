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
} from "@mui/material";
import PropTypes from "prop-types";
import LinearProgressLayer from "../../../../components/LinearProgressLayer";
import useAxios from "../../../../hooks/useAxios";
import useToken from "../../../../hooks/useToken";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import { useForm } from "react-hook-form";

const GuestContact = React.memo(({ onClose }) => {
  const Authorization = useToken();
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
    async ({ email: targetMail }) => {
      const data = { targetMail, object: "connexion" };
      try {
        await refetch({ data });
      } catch (e) {
        console.error(e);
      }
    },
    [refresh]
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
              Pour ajouter un contact, veuillez lui envoyer une invitation via
              son adresse électronique. Vous serez en contact dès que celui-ci
              aura confirmé votre demande. Il est important de s'assurer que le
              contact dispose d'un compte reconnu par la plateforme GEID.
            </Typography>
            <Box>
              <TextField
                name='email'
                label='Adresse électronique'
                color={errors?.email ? "error" : "primary"}
                fullWidth
                {...register("email", {
                  required: "Saisissez l'adresse mail du contact",
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: "Entrez une adresse mail valide",
                  },
                })}
              />
              <Fade in={Boolean(errors?.email)}>
                <FormHelperText sx={{ color: "error.main", height: 15 }}>
                  {errors?.email?.message}
                </FormHelperText>
              </Fade>
            </Box>
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
});

GuestContact.propTypes = {
  onClose: PropTypes.func,
};

export default GuestContact;
