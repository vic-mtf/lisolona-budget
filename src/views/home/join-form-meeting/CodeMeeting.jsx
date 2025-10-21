import { useCallback /*,useLayoutEffect*/ } from 'react';
import { Box, FormLabel, Toolbar } from '@mui/material';
import InputCode from '../../../components/InputCode';
import { useNavigate } from 'react-router-dom';
import messages from './messages';
import PropTypes from 'prop-types';
import { useNotifications } from '@toolpad/core/useNotifications';

const CodeMeeting = ({ code, loading, refetch }) => {
  const navigateTo = useNavigate();
  const notifications = useNotifications();

  const handleCompleteCode = useCallback(
    async (value) => {
      if (!loading) {
        try {
          const { data: meeting } = await refetch({
            url: `api/chat/room/call/${value?.join('')}`,
          });
          navigateTo('/', { replace: true, state: { meeting } });
        } catch (error) {
          const status = error?.request?.status;
          const { message, severity } = messages[status] || {};
          if (severity)
            notifications.show(message, { severity, autoHideDuration: 5000 });
        }
      }
    },
    [notifications, refetch, loading, navigateTo]
  );

  return (
    <Box
      display="flex"
      gap={1}
      width="100%"
      flexDirection="column"
      alignItems="center"
    >
      <Toolbar variant="dense" disableGutters>
        <FormLabel mb={1}>
          Entrez le code de la réunion pour participer
        </FormLabel>
      </Toolbar>
      <div style={{ width: 'auto', display: 'inline-flex' }}>
        <InputCode
          length={9}
          size={38}
          values={code?.split('') || []}
          onComplete={handleCompleteCode}
        />
      </div>
    </Box>
  );
};

CodeMeeting.propTypes = {
  code: PropTypes.string,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default CodeMeeting;
