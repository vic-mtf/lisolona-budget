import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Fade from '@mui/material/Fade';
import PropTypes from 'prop-types';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
// import { useDispatch } from "react-redux";
// import useHandleJoinMeeting from "../../main/action/useHandleJoinMeeting";
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';
import { useForm } from 'react-hook-form';

// import { useNavigate } from "react-router-dom";

// import { CHANNEL } from "../Home";
// import { setData } from "../../../redux/meeting";
// import { updateUser } from "../../../redux/user";

const IdentifyForm = ({ loading, code, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const dispatch = useDispatch();
  // const navigateTo = useNavigate();
  // const handleJoinMeeting = useHandleJoinMeeting("guest");

  const handleSendData = useCallback(
    async ({ name }) => {
      const data = await refetch({
        url: '/api/chat/guest/create',
        method: 'POST',
        data: { name, code },
      });
      console.log(data);
    },

    [refetch, code]
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
            endIcon={<LaunchOutlinedIcon />}
            startIcon={<CoPresentOutlinedIcon />}
            type="submit"
          >
            Participer à la réunion
          </Button>
        </div>
      </Box>
    </Box>
  );
};

IdentifyForm.propTypes = {
  loading: PropTypes.bool,
  refetch: PropTypes.func,
  code: PropTypes.string,
};

export default IdentifyForm;
