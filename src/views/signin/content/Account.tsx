import {
  Box,
  Divider,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import useCheckTokenAccount from "./useCheckTokenAccount";
import getFullName from "@/utils/getFullName";

type Step = "userfound" | "useremail" | "password";

export default function Account({
  user,
  refresh,
  setStep,
}: {
  user: Record<string, unknown>;
  refresh: Function;
  setStep: (step: Step) => void;
}) {
  const handleCheckAccount = useCheckTokenAccount({ refresh, user });

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="text.primary" paragraph>
        Un compte trouvé sur cet appareil, souhaitez-vous ouvrir une session
        avec celui-ci ?
      </Typography>
      <ListItemButton onClick={handleCheckAccount}>
        <ListItemAvatar>
          <Avatar src={user.image as string} variant="rounded" />
        </ListItemAvatar>
        <ListItemText
          primary={getFullName(user)}
          secondary={user.email as string}
          secondaryTypographyProps={{
            variant: "body2",
            color: "text.secondary",
          }}
        />
      </ListItemButton>
      <Divider variant="inset" />
      <Box justifyContent="right" display="flex" mt={1}>
        <Typography
          variant="body2"
          fontWeight="bold"
          color="primary.main"
          sx={{ textDecoration: "none", cursor: "pointer" }}
          onClick={() => setStep("useremail")}
        >
          Se connecter avec un autre compte
        </Typography>
      </Box>
    </Box>
  );
}
