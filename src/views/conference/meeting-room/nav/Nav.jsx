import Box from '@mui/material/Box';
import navActions from '../footer/nav-actions/navActions';
import Fade from '@mui/material/Fade';
import { useSelector } from 'react-redux';

const Nav = () => {
  const nav = useSelector((store) => store.conference.meeting.nav.id);
  return (
    <Box display="flex" flex={1} bgcolor="background.paper">
      {navActions.map(({ id, content: Component = 'div' }) => (
        <Fade
          in={id === nav}
          appear={false}
          key={id}
          unmountOnExit
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Box>
            <Component />
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export default Nav;
