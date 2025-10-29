import React, { useCallback, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IconButton, Box, Typography, Toolbar, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import LinearProgressLayer from '../../../../components/LinearProgressLayer';
import useAxios from '../../../../hooks/useAxios';
import useToken from '../../../../hooks/useToken';
import CodeScanner from './CodeScanner';
import parseConferenceUrl, {
  checkPopupPermission,
} from '../../../../utils/parseConferenceUrl';
import { updateConferenceData } from '../../../../redux/conference/conference';
import { useDispatch, useSelector } from 'react-redux';
import normalizeObjectKeys from '../../../../utils/normalizeObjectKeys';
import { useNotifications } from '@toolpad/core/useNotifications';
// import getLocalIP from '../../../../utils/getLocalIP';

const ScanMeeting = React.memo(({ onClose }) => {
  const [paused, setPaused] = useState(false);
  const Authorization = useToken();
  const dispatch = useDispatch();
  const userId = useSelector((store) => store.user.id);
  const notifications = useNotifications();

  const [{ loading }, refetch] = useAxios(
    {
      headers: { Authorization },
      method: 'GET',
    },
    { manual: true }
  );

  const onScan = useCallback(
    async (data) => {
      const [{ rawValue }] = data;
      const { code, origin: baseUrl } = parseConferenceUrl(rawValue);

      const urls = ['geidbudget.com'];

      if (
        (import.meta.env.DEV ? true : urls.includes(baseUrl)) &&
        code.length === 9
      ) {
        setPaused(true);
        try {
          const response = await refetch({
            url: '/api/chat/room/call/' + code,
          });
          const data = normalizeObjectKeys(response?.data);
          const url = import.meta.env.BASE_URL + `/conference/${data.id}`;

          if (!checkPopupPermission()) {
            notifications.show(
              'Votre bloque des popups. Veuillez autoriser les popups et réessayer',
              { severity: 'warning' }
            );
            setPaused(false);
            return;
          }

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
        } catch (e) {
          const status = e?.request?.status;
          const message =
            status === 404
              ? 'Le code de la reunion fourni est incorrect'
              : 'Une erreur inattendue est survenue, Merci de réessayer ultérieurement';
          notifications.show(message, { severity: 'error' });
        }
        if (typeof onClose === 'function') onClose();
        setPaused(false);
      }
    },
    [refetch, userId, dispatch, notifications, onClose]
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
            Rejoindre une reunion par le QrCode
          </Typography>
        </Toolbar>
        <Box
          overflow="auto"
          position="relative"
          minHeight={{ md: 250 }}
          flex={1}
          width={{ md: 450, xs: '100%' }}
        >
          <Stack p={2} spacing={4}>
            <Typography color="text.secondary">
              Scannez le code QR fourni par l’hôte pour rejoindre la réunion.
            </Typography>
            <Box overflow="hidden" position="relative" display="flex">
              <CodeScanner onScan={onScan} paused={paused} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
});

ScanMeeting.displayName = 'ScanMeeting';
ScanMeeting.propTypes = {
  onClose: PropTypes.func,
};

export default ScanMeeting;
