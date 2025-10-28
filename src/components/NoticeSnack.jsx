import React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import ListAvatar from '../components/ListAvatar';
import PropTypes from 'prop-types';

const NoticeSnack = ({ name, id, message, src, inline, action }) => {
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

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="flex-start"
        maxWidth={{ xs: 320, xl: 400 }}
      >
        <Box>
          <ListAvatar id={id} src={src}>
            {name?.charAt(0)}
          </ListAvatar>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box>
            <Typography
              color="text.primary"
              variant="body1"
              component={inline ? 'span' : 'div'}
            >
              {name}
            </Typography>{' '}
            <Typography
              color="text.secondary"
              variant="body2"
              component={inline ? 'span' : 'div'}
            >
              {message}
            </Typography>
          </Box>
          {action && (
            <DialogActions sx={{ m: 0, p: 0 }}>{action}</DialogActions>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

NoticeSnack.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  message: PropTypes.string,
  src: PropTypes.string,
  inline: PropTypes.bool,
  action: PropTypes.node,
};
export default React.memo(NoticeSnack);
