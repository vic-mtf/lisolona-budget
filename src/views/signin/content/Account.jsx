import {
  Box as MuiBox,
  Divider,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import Typography from "../../../components/Typography";
import Avatar from "../../../components/Avatar";
import { useCheckTokenAccount } from "../../../hooks/useSignInSendData";
import getFullName from "../../../utils/getFullName";
import Button from "../../../components/Button";

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
          <Avatar src={user.image} />
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
