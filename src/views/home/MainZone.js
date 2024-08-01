import { Stack, Box as MuiBox } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import Typography from "../../components/Typography";
import Checking from "./checking/Checking";
import openSignIn from "../../utils/openSignIn";
import Button from "../../components/Button";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";

export default function MainZone() {
  //const location = useLocation();
  // const checking = useMemo(() =>
  //     comparePathnames(location.pathname, 'home/checking'),
  //     [location.pathname]
  // );

  const handleOpenSignIn = (event) => {
    event?.preventDefault();
    openSignIn();
  };

  return (
    <MuiBox
      p={2}
      sx={{
        pt: {
          xs: 8,
          md: 24,
        },
        // justifyContent: { md: "center" },
        // alignItems: "center",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
      <Stack spacing={2}>
        <Typography variant='h4' fontSize={32}>
          Optimisez la collaboration et renforcez l'efficacité de vos réunions
          en ligne
        </Typography>
        <Typography color='text.secondary' variant='body1'>
          Découvrez une nouvelle dimension de la collaboration avec Lisolo na
          Budget. Grâce aux outils innovants, transformez vos réunions en ligne
          en expériences productives et stimulantes. Gagnez du temps, améliorez
          votre communication et atteignez vos objectifs plus rapidement
        </Typography>
        <MuiBox width='100%'>
          <Button
            variant='outlined'
            startIcon={<LockOutlinedIcon />}
            onClick={handleOpenSignIn}
            endIcon={<LaunchOutlinedIcon />}>
            Connectez-vous
          </Button>
        </MuiBox>
        <Checking />
      </Stack>
    </MuiBox>
  );
}
