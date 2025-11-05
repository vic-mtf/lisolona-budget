import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import InputCode from '../../../components/InputCode';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import messages from './messages';
import PropTypes from 'prop-types';
import { useNotifications } from '@toolpad/core/useNotifications';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import ScanMeeting from '../../main/forms/scan-meeting/ScanMeeting';
import useSmallScreen from '../../../hooks/useSmallScreen';

const CodeMeeting = ({ code, loading, refetch }) => {
  const navigateTo = useNavigate();
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);
  const matches = useSmallScreen();

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
  const onClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Box
        display="flex"
        gap={1}
        width="100%"
        flexDirection="column"
        alignItems="center"
        color="text.primary"
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
        <Typography width="100%" my={2}>
          <Divider variant="middle">Ou</Divider>
        </Typography>

        <>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<QrCodeScannerIcon />}
            endIcon={<OpenInBrowserIcon />}
            onClick={() => setOpen(true)}
          >
            Scanner le code QR
          </Button>
        </>
      </Box>
      <Dialog open={open} onClose={onClose} fullScreen={matches}>
        <ScanMeeting onClose={onClose} />
      </Dialog>
    </>
  );
};

CodeMeeting.propTypes = {
  code: PropTypes.string,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default CodeMeeting;
