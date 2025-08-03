import {
  Box,
  Paper,
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
} from "@mui/material";
import ListAvatar from "../../../../components/ListAvatar";
import useSmallScreen from "../../../../hooks/useSmallScreen";
import ToolbarIdentity from "./ToolbarIdentity";

const RoomInfos = () => {
  const matches = useSmallScreen();
  return (
    <Box
      width={{ md: 400 }}
      display='flex'
      flex={1}
      flexGrow={1}
      component={Paper}
      sx={{
        borderRadius: 2,
        alignItems: "start",
        flexDirection: "column",
        overflow: "hidden",
        ...(matches && {
          bgcolor: "transparent",
        }),
      }}
      elevation={0}>
      {!matches && <ToolbarIdentity />}
      <Box
        display='flex'
        flex={1}
        width='100%'
        flexDirection='column'
        gap={2}
        justifyContent='center'
        alignItems='center'
        py={{ xs: 2, md: 0 }}>
        <Typography color='textSecondary' align='center'>
          Vous êtes sur le point de lancer un appel
        </Typography>
        <Box>
          <Button variant='contained' color='primary'>
            {"Lancer l'appel"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RoomInfos;
