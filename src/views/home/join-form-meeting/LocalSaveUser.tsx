import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListAvatar from '../../../components/ListAvatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { updateUser } from '../../../redux/user';
import { updateApp } from '../../../redux/app';
import { useLocation, useNavigate } from 'react-router-dom';
import { decrypt, encrypt } from '../../../utils/crypt';

const LocalSaveUser = ({ setStep, refetch, code }) => {
  const encryptedGuest = useSelector((store) => store.app.guest);
  const guest = useMemo(() => decrypt(encryptedGuest), [encryptedGuest]);

  // const name = useSelector((store) => store.user.name);
  // const id = useSelector((store) => store.user.id);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { state } = useLocation();
  const meeting = useMemo(() => state?.meeting, [state?.meeting]);

  const handleSendData = useCallback(async () => {
    const name = guest?.name;
    const id = guest?.id;
    let response = await refetch({
      url: '/api/chat/guest/create',
      method: 'POST',
      data: { name, code, id },
    });
    const token = response.data.token;
    dispatch(
      updateUser({
        data: { token, name, id, isGuest: true },
      })
    );
    dispatch(
      updateApp({
        data: {
          guest: encrypt({ token, name, id, isGuest: true }),
        },
      })
    );
    const target = {
      type: meeting?.room ? 'room' : 'direct',
      ...meeting?.room,
    };
    navigateTo(`/conference/${code}`, {
      // replace: true,
      state: { target },
    });
  }, [refetch, code, dispatch, navigateTo, meeting, guest]);

  return (
    <Box>
      <Typography mb={1}>
        {
          "Poursuivre la réunion en utilisant l'identité sauvegardée lors de la session précédente"
        }
      </Typography>
      <Divider />
      <ListItem disableGutters disablePadding>
        <ListItemButton onClick={handleSendData}>
          <ListItemAvatar>
            <ListAvatar id={guest?.id}>{guest?.name.charAt(0)}</ListAvatar>
          </ListItemAvatar>
          <ListItemText primary={guest?.name} />
        </ListItemButton>
      </ListItem>
      <Button
        sx={{ mt: 2 }}
        endIcon={<NavigateNextIcon />}
        onClick={() => setStep(0)}
        variant="outlined"
      >
        {"S'identifier avec un autre nom"}
      </Button>
    </Box>
  );
};

export default LocalSaveUser;
