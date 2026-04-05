import { Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DiscussionList from '../../navigation/discussions/DiscussionList';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { startNewCall } from '../../../../utils/handleStartNewCall';

export default function InstantMeeting({ onClose }) {
  const handleCall = async (_, user) => {
    await startNewCall({
      id: user?.id,
      name: user.name,
      type: user?.type,
      image: user?.image,
      description: user?.description,
    });
  };
  return (
    <>
      <Box
        component="form"
        overflow="hidden"
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseOutlinedIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Démarrer une réunion instantanée
          </Typography>
        </Toolbar>
        <Box
          overflow="auto"
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
            <Box>
              <Toolbar disableGutters sx={{ px: 2 }} variant="dense">
                <Typography color="text.secondary">
                  Sélectionnez une discussion ou un contact
                </Typography>
              </Toolbar>
              <DiscussionList
                onClose={onClose}
                onClickItem={handleCall}
                secondaryAction={({ type, onClick }) => (
                  <Tooltip
                    title={`Lancer ${
                      type === 'room' ? 'la réunion' : "l'appel"
                    }`}
                  >
                    <IconButton edge="end" onClick={onClick}>
                      <CallOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
