import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Box as MuiBox,
    LinearProgress,
    Backdrop,
    Alert
} from '@mui/material';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignalWifiBadOutlinedIcon from '@mui/icons-material/SignalWifiBadOutlined';
import { addData } from '../../../../redux/data';
import InputCode from "../../../../components/InputCode";
import useAxios from '../../../../utils/useAxios';
import Button from '../../../../components/Button';
import { useSnackbar } from 'notistack';

const _DIALOG_NAME = 'join-meeting-by-code';

export default function JoinMeetingByCode () {
    const dialog = useSelector(store => store.data.dialog);
    const open = useMemo(() => dialog === _DIALOG_NAME);
    const token = useSelector(store => store.user.token);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [{loading}, refetch, cancel] = useAxios({
        headers: {Authorization: `Bearer ${token}`}
    }, {manual: true});
    const dispatch = useDispatch();
    const onClose = () => {
        dispatch(addData({key: 'dialog', data: null}));
        if(loading) cancel();
    };
    return (
        <Dialog 
            open={open} 
            onClose={null} 
            aria-labelledby={_DIALOG_NAME}
            BackdropProps={{
                sx: {
                    bgcolor: theme => theme.palette.background.paper +
                    theme.customOptions.opacity,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                }
            }}
            sx={{
                '& .MuiDialog-paper': {
                    position: 'relative',
                    overflow: 'hidden',
                    maxWidth: 600
                }
            }}
        >
        {loading &&
        <LinearProgress
            sx={{
                width: '100%',
                position: 'absolute',
                top: 0,
                zIndex: theme => theme.zIndex.tooltip
            }}
        />}
          <DialogTitle>
            Rejoindre une reunion
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
                Pour rejoindre votre réunion en cours, 
                veuillez entrer le code unique de 9 caractères 
                fourni par l'hôte de la réunion dans le champ ci-dessous. 
                Ce code est nécessaire pour accéder à la réunion en cours, 
                veuillez donc vous assurer que vous l'avez correctement saisi.
                Si vous avez des difficultés à trouver ou à entrer le code de la réunion, 
                veuillez contacter l'hôte de la réunion pour obtenir de l'aide.
            </DialogContentText>
            <MuiBox
                justifyContent="center"
                alignContent="center"
                display="flex"
                my={2}
            >
                <InputCode
                    length={9}
                    onComplete={async (code) => {
                        const id = code.join('');
                        try {
                            const data = await refetch({url: '/api/chat/room/call/' + id})
                        } catch (e) {
                            const alertData = {
                                message: null,
                                icon: undefined,
                                title: null,
                                severity: "error",
                            }
                            if(e?.code === 'ERR_NETWORK') {
                                alertData.message = (
                                    <>
                                        <b>Lisolo Na Budget</b> peine à récupérer des données, 
                                        votre appareil n'est plus relié au réseau Internet.
                                    </>
                                );
                                alertData.icon = <SignalWifiBadOutlinedIcon/>;
                                alertData.severity = "warning";
                            }

                            if(e?.response?.status === 404) {
                                alertData.message = `Désolé, code invalide. Veuillez vérifier et réessayer.`;
                            }
                           
                            if(alertData.message) 
                                enqueueSnackbar({
                                    message: alertData.message,
                                    content: (key, message) => (
                                        <Alert 
                                            onClose={() => closeSnackbar(key)} 
                                            severity={alertData.severity}
                                            icon={alertData.icon}
                                            sx={{
                                                maxWidth: 400,
                                            }}
                                        >
                                            {message}
                                        </Alert>
                                    ),
                                    style: {
                                        background: 'none',
                                        boxShadow: 0,
                                        padding: 0,
                                        margin: 0,
                                    }
                                })
                        }
                    }}
                />
            </MuiBox>
            <Backdrop 
                open={loading} 
                sx={{
                    height: '100%',
                    width: '100%',
                    background: theme => theme.palette.background.paper + 
                    theme.customOptions.opacity,
                }}
            />
          </DialogContent>
          <DialogActions>
            <Button
                onClick={onClose}
                color="primary"

                >
                Annuler
            </Button>
          </DialogActions>
        </Dialog>
    )
}