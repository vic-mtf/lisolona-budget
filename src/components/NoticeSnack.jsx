import React from 'react';
import {
  createTheme,
  ThemeProvider,
  useTheme,
  Box,
  Typography,
  DialogActions,
} from '@mui/material';
import ListAvatar from '../components/ListAvatar';
import PropTypes from 'prop-types';
import HighlightWord from './HighlightWord';

const NoticeSnack = ({
  name,
  id,
  message,
  src,
  inline,
  action,
  words = [],
  inlineAction = false,
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

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems={inlineAction ? 'center' : 'flex-start'}
        minWidth={{ xs: 300, xl: 400 }}
      >
        <Box>
          <ListAvatar id={id} src={src}>
            {name?.charAt(0)}
          </ListAvatar>
        </Box>

        <Box
          display="flex"
          flexDirection={inlineAction ? 'row' : 'column'}
          gap={1}
          flexGrow={1}
        >
          <Box flexGrow={1}>
            <Typography
              color="text.primary"
              variant="body2"
              component={inline ? 'span' : 'div'}
              sx={{ fontWeight: 550 }}
            >
              {name}
            </Typography>{' '}
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

NoticeSnack.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  message: PropTypes.string,
  src: PropTypes.string,
  inline: PropTypes.bool,
  action: PropTypes.node,
  inlineAction: PropTypes.bool,
  words: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default React.memo(NoticeSnack);
