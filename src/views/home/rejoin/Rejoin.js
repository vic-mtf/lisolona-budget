import {  
    Stack, 
    Link, 
    Box as MuiBox,
  } from '@mui/material';
  
  import Typography from '../../../components/Typography';
  import CheckingCode from '../checking/CheckingCode';
import openSignin from '../../../utils/openSignin';
export default function Rejoin () {
    const handleOpenSignin = event => {
      event?.preventDefault();
      openSignin()
    };
    return (
        <MuiBox
            px={2}
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Stack 
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              spacing={1}
            >
             <Typography variant="h5">
               Bienvenue !
              </Typography>
              <Typography>
                Entrez le code de la réunion pour participer
              </Typography>
              <CheckingCode/>
            </Stack>
            <Typography my={5}>
              La plateforme de réunions en ligne pour un travail 
              collaboratif efficace au sein du Ministère de Budget. 
              Collaborez facilement avec vos collègues, 
              où que vous soyez. <Link href='#' onClick={handleOpenSignin}>Connectez-vous!</Link>
            </Typography>
          </MuiBox>
    )
}