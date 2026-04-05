import Typography from '@mui/material/Typography';
import MoreMenuStyles from '../local-presentation-view/local-presentation-view-header/MoreMenuStyles';
import TabController from '../local-presentation-view/local-presentation-view-header/TabController';
import FocusShapeNav from '../local-presentation-view/local-presentation-view-header/focus-shape-nav/FocusShapeNav';

const LocalUserInfo = () => {
  return (
    <>
      <MoreMenuStyles />
      <Typography ml={1} flexGrow={1}>
        L’écran est partagé avec votre audience
      </Typography>
      <TabController />
      <FocusShapeNav />
    </>
  );
};

export default LocalUserInfo;
