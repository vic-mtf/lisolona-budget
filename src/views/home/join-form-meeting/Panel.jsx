import { Box } from "@mui/material";
import Typography from "../../../components/Typography";
import Button from "../../../components/Button";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import openSignIn from "../../../utils/openSignIn";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";

export default function Panel() {
  const handleOpenSignIn = (event) => {
    event?.preventDefault();
    openSignIn();
  };
  return (
    <>
      <Typography variant='h4' fontSize={32}>
        Optimisez la collaboration et renforcez l'efficacité de vos réunions en
        ligne
      </Typography>
      <Typography color='text.secondary' variant='body1'>
        Découvrez une nouvelle dimension de la collaboration avec Lisolo na
        Budget. Grâce aux outils innovants, transformez vos réunions en ligne en
        expériences productives et stimulantes. Gagnez du temps, améliorez votre
        communication et atteignez vos objectifs plus rapidement
      </Typography>
      <Box width='100%' display='flex' justifyContent='end'>
        <Button
          variant='outlined'
          startIcon={<LockOutlinedIcon />}
          onClick={handleOpenSignIn}
          endIcon={<LaunchOutlinedIcon />}>
          Connectez-vous
        </Button>
      </Box>
    </>
  );
}
