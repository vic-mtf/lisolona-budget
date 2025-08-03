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
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { useForm } from "react-hook-form";
import InputCode from "../../../../components/InputCode";

const JoinMeeting = React.memo(({ onClose }) => {
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
            Participer à une reunion par le code
          </Typography>
        </Toolbar>
        <Box
          overflow='hidden'
          position='relative'
          minHeight={{ md: 250 }}
          flex={1}
          width={{ md: 450, xs: "100%" }}>
          <Stack p={2} spacing={4}>
            <Typography flexGrow={1} color='text.secondary'>
              Entrez le code fourni par l'hôte pour rejoindre la réunion, Si
              vous avez des difficultés, contactez l'hôte pour obtenir de
              l'aide.
            </Typography>
            <Box>
              <Box display='flex' justifyContent='center'>
                <InputCode
                  length={9}
                  size={40}
                  // values={values}
                  // onComplete={handleCompleteCode}
                />
              </Box>
              <Fade in={Boolean(errors?.email)}>
                <FormHelperText sx={{ color: "error.main", height: 15 }}>
                  {errors?.email?.message}
                </FormHelperText>
              </Fade>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
});

JoinMeeting.displayName = "JoinMeeting";

JoinMeeting.propTypes = {
  onClose: PropTypes.func,
};

export default JoinMeeting;
