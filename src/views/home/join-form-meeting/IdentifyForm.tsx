import { useCallback, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Fade from '@mui/material/Fade';
// import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
// import { useDispatch } from "react-redux";
// import useHandleJoinMeeting from "@/views/main/action/useHandleJoinMeeting";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
// import { CHANNEL } from "../Home";
// import { setData } from "@/redux/meeting";
import { updateUser } from '@/redux/user';
import { updateApp } from '@/redux/app';
import { encrypt } from '@/utils/crypt';

const IdentifyForm = ({ loading, code, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { state } = useLocation();
  const meeting = useMemo(() => state?.meeting, [state?.meeting]);

  const handleSendData = useCallback(
    async ({ name }) => {
      let response = await refetch({
        url: '/api/chat/guest/create',
        method: 'POST',
        data: { name, code },
      });
      const data = {
        name: response.data.name,
        id: response.data._id,
        token: response.data.token,
        isGuest: true,
      };
      
      dispatch(updateUser({ data }));
      dispatch(
        updateApp({
          data: {
            guest: encrypt(data),
          },
        })
      );

      const target = {
        type: meeting?.room ? 'room' : 'direct',
        ...meeting?.room,
      };
      navigateTo(`/conference/${code}`, {
        replace: true,
        state: { target },
      });
    },

    [refetch, code, dispatch, navigateTo, meeting]
  );
  const error = errors.name;

  return (
    <Box
      display="flex"
      component="form"
      onSubmit={handleSubmit(handleSendData)}
      gap={1}
      sx={{
        flexDirection: 'column',

        width: { xs: '100%', md: 400 },
      }}
    >
      <Box flexGrow={1} display="flex" flexDirection="column">
        <TextField
          label="Nom complet"
          variant="outlined"
          color={error ? 'error' : 'primary'}
          type="text"
          name="name"
          placeholder="Ex: Victor Mongolo Tanzey"
          {...register('name', {
            required: 'Le nom est requis',
            pattern: {
              value: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/,
              message: 'Entrez un nom valide',
            },
          })}
          sx={{ minWidth: { xs: 'auto', md: 300 } }}
        />
        <Fade in={Boolean(error)} sx={{ height: 20, color: 'error.main' }}>
          <FormHelperText>{error?.message}</FormHelperText>
        </Fade>
      </Box>

      <Box display="flex" flexDirection="row" gap={1}>
        <div>
          <Button
            variant="outlined"
            loading={loading}
            endIcon={<NavigateNextOutlinedIcon />}
            startIcon={<MeetingRoomOutlinedIcon />}
            type="submit"
          >
            Participer à la réunion
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default IdentifyForm;
