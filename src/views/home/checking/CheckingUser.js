import { 
    Stack, 
    TextField, 
    Toolbar,
    Box as MuiBox,
    Link,
} from '@mui/material';
import InputControler from '../../../components/InputControler';
import Typography from '../../../components/Typography';
import { useSelector } from 'react-redux';
import Button from '../../../components/Button';

export default function CheckingUser () {
    const user = useSelector(store => store.user);

    return (
        <Stack
            spacing={1}
            display="flex"
            justifyContent="center"
            flex={1}
            my={2}
        >
            <Typography >
                Pour participer à la réunion, veuillez entrer votre nom ci-dessous. 
                Si vous disposez déjà d'un compte, 
                vous pouvez vous <Link>connecter</Link> en utilisant vos identifiants habituels
            </Typography>
            <MuiBox> 
                <InputControler fullWidth>
                    <TextField
                        placeholder='ex: Viael Mongolo Tanzey'
                        label="Votre nom complet"
                        disabled
                    />
                </InputControler>
            </MuiBox>
        </Stack>
    );
}