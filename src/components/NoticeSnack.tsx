import React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListAvatar from '../components/ListAvatar';
import HighlightWord from './HighlightWord';
import getFullName from '../utils/getFullName';
import { useMemo } from 'react';
import { useEffect } from 'react';

const NoticeSnack = ({
  name: n,
  id: userId,
  src: image,
  message,
  inline,
  action,
  words = [],
  inlineAction = false,
  participants = [],
  showNoticeRef,
}) => {
  const nativeTheme = useTheme();
  const theme = createTheme({
    ...nativeTheme,
    palette: {
      mode: 'light',
      primary: {
        ...nativeTheme.palette.primary,
        main: nativeTheme.palette.primary.main,
      },
    },
  });
  const { name, id, src } = useMemo(() => {
    const [user] = participants || [];
    return {
      name: n || getFullName(user),
      id: userId || user?.id,
      src: image || user?.image,
    };
  }, [n, userId, participants, image]);

  const isMany = participants?.length > 1;

  useEffect(() => {
    if (!Object.hasOwnProperty.call(showNoticeRef || {}, 'current')) return;
    showNoticeRef.current = true;
    return () => {
      showNoticeRef.current = false;
    };
  }, [showNoticeRef]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection={isMany ? 'column' : 'row'}
        gap={2}
        alignItems={inlineAction ? 'center' : 'flex-start'}
        maxWidth={{ xs: 350, xl: 400 }}
      >
        {isMany ? (
          <Box pl={2} width="100%" alignItems="start" display="flex">
            <ListAvatarGroup participants={participants} />
          </Box>
        ) : (
          <Box>
            <ListAvatar id={id} src={src}>
              {name?.charAt(0)}
            </ListAvatar>
          </Box>
        )}

        <Box
          display="flex"
          flexDirection={inlineAction ? 'row' : 'column'}
          gap={1}
          flexGrow={1}
        >
          <Box flexGrow={1}>
            {!isMany && (
              <Typography
                color="text.primary"
                variant="body2"
                component={inline ? 'span' : 'div'}
                sx={{ fontWeight: 550 }}
              >
                {name}
              </Typography>
            )}{' '}
            <Typography
              color="text.secondary"
              variant="body2"
              component={inline ? 'span' : 'div'}
            >
              <HighlightWord text={message} words={words} />
            </Typography>
          </Box>

          {action && (
            <DialogActions sx={{ m: 0, p: 0, mt: 0.5, flexGrow: 1 }}>
              {action}
            </DialogActions>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const ListAvatarGroup = ({ participants }) => {
  return (
    <AvatarGroup
      variant="rounded"
      max={4}
      sx={{
        '& 	.MuiAvatar-root': {
          width: 30,
          height: 30,
          fontSize: 14,
          transform: 'rotate(45deg)',
          borderColor: (t) => t.palette.background.paper,
        },
      }}
    >
      {participants.map(({ id, image, ...other }) => (
        <ListAvatar key={id} src={image} id={id}>
          {getFullName(other).charAt(0)}
        </ListAvatar>
      ))}
    </AvatarGroup>
  );
};

export default React.memo(NoticeSnack);
