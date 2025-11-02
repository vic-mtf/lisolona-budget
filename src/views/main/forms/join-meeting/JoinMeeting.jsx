import React, { useCallback } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IconButton, Box, Typography, Toolbar, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import LinearProgressLayer from '../../../../components/LinearProgressLayer';
import useAxios from '../../../../hooks/useAxios';
import useToken from '../../../../hooks/useToken';
import InputCode from '../../../../components/InputCode';
import { useNotifications } from '@toolpad/core/useNotifications';
import normalizeObjectKeys from '../../../../utils/normalizeObjectKeys';
import { useDispatch, useSelector } from 'react-redux';
import { updateConferenceData } from '../../../../redux/conference/conference';

const JoinMeeting = React.memo(({ onClose }) => {
  const Authorization = useToken();
  const notifications = useNotifications();
  const dispatch = useDispatch();
  const userId = useSelector((store) => store.user.id);

  const [{ loading }, refetch] = useAxios(
    {
      method: 'GET',
      headers: { Authorization },
    },
    { manual: true }
  );

  const handleCompleteCode = useCallback(
    async (value) => {
      const code = value?.join('');
      try {
        const response = await refetch({
          url: '/api/chat/room/call/' + code,
        });
        const data = normalizeObjectKeys(response?.data);
        const url = import.meta.env.BASE_URL + `/conference/${data.id}`;
        window.open(url, '_blank');
        const type = data?.room ? 'room' : 'direct';
        const contact = data.room?.participants?.find(
          ({ identity }) => identity?.id === data?.location
        )?.identity;
        const peer =
          data?.createdBy !== userId ? { ...data?.createdBy, type } : contact;
        const target = type === 'room' ? { ...data?.room, type } : peer;
        dispatch(
          updateConferenceData({
            key: 'callTarget',
            data: target,
          })
        );
      } catch (error) {
        const status = error?.request?.status;
        const message =
          status === 404
            ? 'Le code de la reunion fourni est incorrect'
            : 'Une erreur inattendue est survenue, Merci de réessayer ultérieurement';
        notifications.show(message, { severity: 'error' });
      }
      if (typeof onClose === 'function') onClose();
    },
    [refetch, notifications, onClose, dispatch, userId]
  );

  return (
    <>
      <LinearProgressLayer open={loading} />
      <Box
        overflow="hidden"
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        autoFocus={!loading}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            disabled={loading}
          >
            <CloseOutlinedIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Participer à une reunion par le code
          </Typography>
        </Toolbar>
        <Box
          overflow="hidden"
          position="relative"
          minHeight={{ md: 250 }}
          flex={1}
          width={{ md: 450, xs: '100%' }}
        >
          <Stack p={2} spacing={4}>
            <Typography flexGrow={1} color="text.secondary">
              {`Entrez le code fourni par l'hôte pour rejoindre la réunion, Si
              vous avez des difficultés, contactez l'hôte pour obtenir de
              l'aide.`}
            </Typography>
            <Box>
              <Box display="flex" justifyContent="center">
                <InputCode
                  length={9}
                  size={40}
                  // values={values}
                  onComplete={handleCompleteCode}
                />
              </Box>
              {/* <Fade in={Boolean(errors?.email)}>
                <FormHelperText sx={{ color: 'error.main', height: 15 }}>
                  {errors?.email?.message}
                </FormHelperText>
              </Fade> */}
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
});

JoinMeeting.displayName = 'JoinMeeting';

JoinMeeting.propTypes = {
  onClose: PropTypes.func,
};

export default JoinMeeting;
