import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListAvatar from '../../../../../../components/ListAvatar';
import { useSelector } from 'react-redux';
import getFullName from '../../../../../../utils/getFullName';

const RemoteUserInfo = ({ id }) => {
  const user = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.identity
  );

  const name = getFullName(user);
  return (
    user && (
      <>
        <Box>
          <ListAvatar id={user?.id} src={user.image}>
            {name?.charAt(0)}
          </ListAvatar>
        </Box>
        <Typography ml={1} flexGrow={1}>
          {name}
        </Typography>
      </>
    )
  );
};

export default RemoteUserInfo;
