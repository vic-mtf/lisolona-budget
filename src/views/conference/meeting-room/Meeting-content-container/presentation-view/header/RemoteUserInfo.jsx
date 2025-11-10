import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListAvatar from '../../../../../../components/ListAvatar';
import { useSelector } from 'react-redux';
import getFullName from '../../../../../../utils/getFullName';
import PropTypes from 'prop-types';

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

RemoteUserInfo.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default RemoteUserInfo;
