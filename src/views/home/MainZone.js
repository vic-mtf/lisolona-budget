import {  
    Stack, 
    Box as MuiBox,
  } from '@mui/material';
  import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
  
import Typography from '../../components/Typography';
import CheckingCode from './checking/CheckingCode';
import openSignIn from '../../utils/openSignIn';
import Button from '../../components/Button';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

export default function MainZone () {
    //const location = useLocation();
    // const checking = useMemo(() => 
    //     comparePathnames(location.pathname, 'home/checking'),
    //     [location.pathname]
    // );

    const handleOpenSignIn = event => {
      event?.preventDefault();
      openSignIn()
    };

    return (
        <MuiBox
        px={2}
        sx={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          flex: 1
        }}
      >
        <Stack 
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          gap={2}
        >
         <Typography variant="h6">
            Boostez la collaboration grâce à notre plateforme 
            de réunions en ligne du Ministère du Budget.
          </Typography>
          <Typography color="text.secondary">
            Découvrez une nouvelle dimension du travail en équipe avec Lisolo na Budget. 
            Où que vous soyez, nous rendons la collaboration fluide et productive. 
            Rejoignez-nous et voyez comment nous transformons le travail collaboratif, 
            en rendant les réunions en ligne plus interactives et efficaces.
          </Typography>
          <MuiBox width="100%">
            <Button
              variant="outlined"
              startIcon={<LockOutlinedIcon/>}
              onClick={handleOpenSignIn}
              endIcon={<LaunchOutlinedIcon/>}
            >
              Connectez-vous
            </Button>
          </MuiBox>
          <CheckingCode/>
        </Stack>
      </MuiBox>
    );
}



