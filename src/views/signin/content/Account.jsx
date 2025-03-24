import {
  Box as MuiBox,
  Divider,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import { useCheckTokenAccount } from "../../../hooks/useSignInSendData";
import getFullName from "../../../utils/getFullName";
import ListAvatar from "../../../components/ListAvatar";
import PropTypes from "prop-types";
export default function Account({ user, refresh }) {
  const handleCheckAccount = useCheckTokenAccount({ refresh, user });
  return (
    <MuiBox sx={{ width: "100%" }}>
      <Typography color='text.primary' paragraph>
        Un compte trouvé sur cet appareil, souhaitez-vous ouvrir une session
        avec celui-ci ?
      </Typography>
      <ListItemButton onClick={handleCheckAccount}>
        <ListItemAvatar>
          <ListAvatar src={user.image} invisible id={user?.id}>
            {getFullName(user)?.toUpperCase()?.charAt(0)}
          </ListAvatar>
        </ListItemAvatar>
        <ListItemText
          primary={getFullName(user)}
          secondary={user.email}
          secondaryTypographyProps={{
            variant: "body2",
            color: "text.secondary",
          }}
        />
      </ListItemButton>
      <Divider variant='inset' />
      <MuiBox justifyContent='right' display='flex' mt={1}>
        <Button LinkComponent={ReactRouterLink} to='useremail' type='text'>
          Se connecter avec un notre compte
        </Button>
      </MuiBox>
    </MuiBox>
  );
}

Account.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.instanceOf(null)]),
  refresh: PropTypes.func.isRequired,
};
