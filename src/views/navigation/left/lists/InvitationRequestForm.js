import  {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Box as MuiBox,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import Button from '../../../../components/Button';
import InputController from '../../../../components/InputController';
import { LoadingButton } from '@mui/lab';
import useAxios from '../../../../utils/useAxios';
import { useSelector } from 'react-redux';

export default function InvitationRequestForm ({open, onClose}) {
    const [externalError, setExternalError] = useState(false);
    const token = useSelector(store => store?.user?.token);
    const [{loading}, refetch] = useAxios({
        method: 'post',
        url: '/api/chat/invite',
        headers: {'Authorization': `Bearer ${token}`}
    }, {manual: true});
    const emailRef = useRef();

    const handleSubmit = async event => {
        event.preventDefault();
        const alertData = {
            severity: 'success',
            messages: null,
        }
        if(emailRef.current && externalError) 
           setExternalError(false);
        if(!emailRef.current && !externalError)
            setExternalError(true);
        if(emailRef.current)
         try {
            await refetch({
                data: {targetMail: emailRef.current, object: 'connexion'},
            });
            alertData.messages = `
            L'invitation est envoyée avec succès, ${emailRef.current} sera avisé 
            de la demande de confirmation d'être en contact avec vous.`;
            alertData.severity = 'success';
        } catch (e) {
            const status = e?.response?.status;
            if(status === 404 || status === 409) {
                alertData.messages = ``
            }
            else ;//error;

        }
    };

    return (
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
                            <InputController
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
                            </InputController>
                            </MuiBox>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            //onClick={handleClose}
                            color="primary"
                        > Annuler </Button>
                        <LoadingButton
                            color="primary"
                            variant="outlined"
                            type="submit"
                            size="small"
                            sx={{textTransform: 'none'}}
                            loading={loading} > Soumettre l'invitation
                        </LoadingButton>
                    </DialogActions>
            </Dialog>
    )
}

const getMessages = (email) => ({
    success: `
    L'invitation est envoyée avec succès, "${email}" sera avisé 
    de la demande de confirmation d'être en contact avec vous.`,
    warning404: `
    Il n'est pas possible d'envoyer votre invitation via GEID, 
    car il existe déjà une demande en attente ou une demande a déjà été acceptée. 
    Si vous ne voyez pas l'adresse e-mail "${email}" dans votre liste 
    de contacts, veuillez patienter,
    jusqu'à ce que vous receviez une réponse à votre invitation.`,
    warning409: `Il n'est pas possible d'envoyer votre invitation via GEID, 
    car il existe déjà une demande en attente ou une demande a déjà été acceptée. 
    Si vous ne voyez pas l'adresse e-mail "${email}" dans votre liste 
    de contacts, veuillez patienter 
    jusqu'à ce que vous receviez une réponse à votre invitation.`,
    error: `Impossibilité de soumettre cette invitation en raison d'un problème 
    résultant d'une mauvaise tentation ou d'une manipulation inappropriée.`
})