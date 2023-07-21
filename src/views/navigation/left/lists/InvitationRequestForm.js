import  {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Box as MuiBox,
    Alert,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import Button from '../../../../components/Button';
import InputControler from '../../../../components/InputControler';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { LoadingButton } from '@mui/lab';
import useAxios from '../../../../utils/useAxios';
import { useSelector } from 'react-redux';

export default function InvitationRequestForm () {
    const [{
        open,
        severity,
        status,
        externalError
    }, setValues] = useState({});
   
    const token = useSelector(store => store?.user?.token);
    const [{loading}, refresh] = useAxios({
        method: 'post',
        url: '/api/chat/invite',
        headers: {'Authorization': `Bearer ${token}`}
    }, {manual: true});
    const emailRef = useRef();
    
    const handleClose = event => {
        event.preventDefault();
        setValues({});
    };

    const handleSubmit = event => {
        event.preventDefault();
        if(emailRef.current && externalError) 
            setValues(values => ({
                ...values, 
                externalError: false
            }));
        if(!emailRef.current && !externalError)
            setValues(values => ({
                ...values, 
                externalError: true
            }));
        if(emailRef.current)
            refresh({
                data: {
                    targetMail: emailRef.current,
                    object: 'connexion'
                },
            }).then(() => {
                setValues(values => ({...values, severity: 'success'}));
            }).catch(({response: {status}}) => {
                if(status === 404 || status === 409)
                    setValues(values => ({
                        ...values, 
                        severity: 'warning', 
                        status
                    }));
                else 
                    setValues(values => ({
                        ...values, 
                        severity: 'error', 
                        status
                    }));
            });
    };

    return (
        <React.Fragment>
            <Button
                children="Inviter un contact" 
                variant="outlined"
                color="inherit"
                sx={{mx: 'auto'}}
                startIcon={<PersonAddAlt1OutlinedIcon/>}
                onClick={() => setValues(values => ({...values, open: true}))}
            />
            <Dialog 
                open={Boolean(open)}
                BackdropProps={{
                    sx: {
                        bgcolor: theme => theme.palette.background.paper +
                        theme.customOptions.opacity,
                        backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    }
                }}
                PaperProps={{
                    sx: { maxWidth: 500},
                    onSubmit: handleSubmit,
                    component: 'form'
                }}
            >
                <DialogTitle variant='h6' fontSize={18} fontWeight="bold">
                    Inviter un contact
                </DialogTitle>
                    <DialogContent>
                        {severity === 'success' ?
                        (
                        <Alert>
                            L'invitation est envoyée avec succès, {emailRef.current} sera avisé 
                            de la demande de confirmation d'être en contact avec vous.
                        </Alert>
                        ) :
                        (
                        <React.Fragment>
                            <DialogContentText
                                variant="body2"
                                component="div"
                                paragraph
                            >
                               Pour initier une connexion avec un contact, 
                               il est conseillé d'envoyer une invitation par courrier électronique. 
                               Afin de garantir que la connexion soit établie sur la plateforme GEID, 
                               il est important de s'assurer que le contact dispose d'un compte 
                               reconnu par cette plateforme.
                            </DialogContentText>
                            <MuiBox>
                            <InputControler
                                type="email"
                                valueRef={emailRef}
                                margin="dense"
                                externalError={externalError}
                                autoControler
                                fullWidth
                            >
                                <TextField
                                    label="Adresse électronique"
                                />
                            </InputControler>
                            </MuiBox>
                            {severity === 'warning' &&
                            <Alert severity="warning">
                                {status === 404 &&
                                `Nous avons détecté que l'adresse e-mail "${emailRef.current}" n'est 
                                pas reconnue par GEID, car l'utilisateur correspondant n'a 
                                pas été trouvé sur la plateforme. Pour continuer, 
                                nous vous invitons à saisir l'adresse e-mail d'un 
                                utilisateur existant sur GEID.`}
                                {status === 409 &&
                                `Il n'est pas possible d'envoyer votre invitation via GEID, 
                                car il existe déjà une demande en attente ou une demande a déjà été acceptée. 
                                Si vous ne voyez pas l'adresse e-mail "${emailRef.current}" dans votre liste 
                                de contacts, veuillez patienter 
                                jusqu'à ce que vous receviez une réponse à votre invitation.`}
                            </Alert>}
                            {severity === 'error' &&
                            <Alert severity="error">
                                Impossibilité de soumettre cette invitation en raison d'un problème 
                                résultant d'une mauvaise tentation ou d'une manipulation inappropriée.
                            </Alert>}
                        </React.Fragment>
                        )}
                    </DialogContent>
                    <DialogActions>
                        {severity !== 'success' ?
                            (
                                <React.Fragment>
                                    <Button
                                        onClick={handleClose}
                                        color="primary"
                                    >
                                    Annuler
                                    </Button>
                                    <LoadingButton
                                        color="primary"
                                        variant="outlined"
                                        type="submit"
                                        size="small"
                                        sx={{textTransform: 'none'}}
                                        loading={loading}
                                    >
                                        Soumettre l'invitation
                                    </LoadingButton>
                                </React.Fragment>
                            ) :
                            (
                                <Button
                                    onClick={handleClose}
                                    variant="outlined"
                                >D'accord</Button>
                            )
                        }
                    </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}