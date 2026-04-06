import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DiscussionList from '@/views/main/navigation/discussions/DiscussionList';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import { useState, useCallback, useMemo } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ScheduledMeetingForm from './ScheduledMeetingForm';
import { useForm, FormProvider } from 'react-hook-form';
import dayjs from 'dayjs';
import LinearProgressLayer from '@/components/LinearProgressLayer';
import useToken from '@/hooks/useToken';
import useAxios from '@/hooks/useAxios';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useDispatch } from 'react-redux';
import store from '@/redux/store';
import { updateArraysData } from '@/redux/data/data';

const ScheduledMeeting = ({ onClose, room }) => {
  const [data, setData] = useState(room);
  const notifications = useNotifications();
  const dispatch = useDispatch();

  const duration = useMemo(() => dayjs().hour(1).minute(0).second(0), []);
  const date = useMemo(() => dayjs().add('1', 'hour').toString(), []);
  const time = useMemo(() => dayjs().add('1', 'hour'), []);

  const methods = useForm({
    values: {
      date,
      time,
      duration,
    },
  });
  const Authorization = useToken();
  const [{ loading }, refetch] = useAxios(
    {
      url: '/api/chat/call/create',
      method: 'POST',
      headers: { Authorization },
    },
    { manual: true }
  );
  const nav = useMemo(() => (data ? 'scheduled-form' : 'contact-list'), [data]);

  const onSubmit = useCallback(
    async (fields) => {
      const duration = dayjs(fields.duration);
      if (duration.hour() * 60 + duration.minute() < 5) {
        methods.setError('duration', {
          message: 'La réunion doit durer au moins 5 minutes.',
          type: 'value',
        });
        return;
      }
      const key = 'scheduled-meeting-' + data?.id;

      try {
        const time = dayjs(fields.time);
        const startedAt = dayjs(fields.date)
          .hour(time.hour())
          .minute(time.hour())
          .toDate();
        const endedAt = dayjs(startedAt)
          .add(duration.hour(), 'hour')
          .add(duration.minute(), 'minute')
          .toDate();

        const response = await refetch({
          data: {
            target: data?.id,
            type: 'room',
            tokenType: 'uid',
            role: 'publisher',
            scheduled: true,
            startedAt,
            endedAt,
            title: fields.title,
            description: fields.description,
          },
        });
        const user = store.getState().user;

        dispatch(updateArraysData({ data: { calls: [response.data] }, user }));
        dispatch({
          type: 'data/updateData',
          payload: {
            key: `app.actions.calls.blink.${response.data._id}`,
            data: true,
          },
        });
        notifications.show('La reunion a bien été planifiée', {
          key,
          severity: 'success',
        });
      } catch (err) {
        console.error(err);
        notifications.show(
          'Une erreur est survenue lors de la planification de la reunion. Réessayez ultérieurement',
          {
            key,
            severity: 'error',
          }
        );
      }
      onClose();
    },
    [data, methods, refetch, notifications, onClose, dispatch]
  );
  const isContactListOrRoom = useMemo(
    () => nav === 'contact-list' || room,
    [nav, room]
  );

  const secondaryAction = useCallback(
    (data) => (
      <IconButton edge="end" onClick={data?.onClick}>
        <NavigateNextOutlinedIcon />
      </IconButton>
    ),
    []
  );
  const onClickItem = useCallback((_, data) => setData(data), []);

  return (
    <>
      <LinearProgressLayer open={loading} />
      <Box
        component="form"
        overflow="hidden"
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            disabled={loading}
            onClick={isContactListOrRoom ? onClose : () => setData(null)}
            aria-label="close"
            key={nav}
          >
            {isContactListOrRoom ? (
              <CloseOutlinedIcon />
            ) : (
              <ArrowBackOutlinedIcon />
            )}
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Planifier une réunion
          </Typography>
        </Toolbar>
        <Box
          sx={{ overflowY: 'auto' }}
          position="relative"
          minHeight={{ md: 250 }}
          flex={1}
          width={{ md: 450, xs: '100%' }}
        >
          <Box
            overflow="hidden"
            position="relative"
            minHeight={{ md: 500, lg: 550, xl: 700, xs: '100%' }}
            flex={1}
            width={{ md: 450 }}
            sx={{
              '& > div': {
                display: 'flex',
                overflow: 'hidden',
                position: 'absolute',
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                top: 0,
                left: 0,
              },
            }}
          >
            <Slide
              in={nav === 'contact-list'}
              unmountOnExit={Boolean(room)}
              appear={false}
              direction="right"
              style={{
                zIndex: nav === 'contact-list' ? 1 : -1,
              }}
            >
              <Box
                display="flex"
                flex={1}
                overflow="hidden"
                flexDirection="column"
              >
                <Toolbar disableGutters sx={{ px: 2 }} variant="dense">
                  <Typography color="text.secondary">
                    Sélectionnez Lisanga avec lequel vous souhaitez planifier la
                    réunion.
                  </Typography>
                </Toolbar>
                <DiscussionList
                  onClose={onClose}
                  closable={false}
                  onClickItem={onClickItem}
                  itemType="group"
                  secondaryAction={secondaryAction}
                />
              </Box>
            </Slide>
            <Slide
              in={nav === 'scheduled-form'}
              appear={false}
              direction="left"
              style={{ zIndex: nav === 'scheduled-form' ? 1 : -1 }}
            >
              <Box
                display="flex"
                flex={1}
                overflow="hidden"
                flexDirection="column"
              >
                <FormProvider {...methods}>
                  <ScheduledMeetingForm data={data} loading={loading} />
                </FormProvider>
              </Box>
            </Slide>
          </Box>
        </Box>
        <DialogActions>
          <Button
            variant="outlined"
            endIcon={<CheckOutlinedIcon />}
            disabled={!data || loading}
            type="submit"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Box>
    </>
  );
};

export default React.memo(ScheduledMeeting);
