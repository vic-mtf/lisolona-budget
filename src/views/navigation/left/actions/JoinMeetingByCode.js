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
import useCustomSnackbar from '../../../../components/useCustomSnackbar';
import IconButton from '../../../../components/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import useHandleJoinMeeting from '../../../main/action/useHandleJoinMeeting';
const _DIALOG_NAME = 'join-meeting-by-code';

export default function JoinMeetingByCode () {
    const dialog = useSelector(store => store.data.dialog);
    const open = useMemo(() => dialog === _DIALOG_NAME, [dialog]);
    const token = useSelector(store => store.user.token);
    const handleJoinMeeting = useHandleJoinMeeting();
    const {enqueueCustomSnackbar, closeCustomSnackbar} = useCustomSnackbar();
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
            onClose={onClose} 
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
                Pour accéder à la réunion en cours, saisissez le code unique de 9 caractères 
                fourni par l'hôte dans le champ ci-dessous. Veuillez vérifier 
                l'exactitude du code, car il est indispensable pour participer à la réunion. 
                Si vous rencontrez des difficultés pour trouver ou saisir le code, 
                veuillez contacter l'hôte de la réunion pour obtenir de l'assistance.
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
                            const result = await refetch({url: '/api/chat/room/call/' + id});
                            handleJoinMeeting({
                                data: {
                                    id: result?.data?.room?.id,
                                    name: result?.data?.room?.name,
                                    avatarSrc: result?.data?.room?.avatarSrc,
                                    type: 'room',
                                },
                                origin: result.data,
                            });
                            onClose();
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
                           
                            if(alertData.message) {
                                let key;
                                enqueueCustomSnackbar({
                                    message: alertData.message,
                                    severity: alertData.severity,
                                    getKey: (_key) => key = _key,
                                    icon: alertData.icon,
                                    action: (
                                        <IconButton
                                            onClick={() => closeCustomSnackbar(key)}
                                        >
                                            <CloseOutlinedIcon/>
                                        </IconButton>
                                    )
                                })
                            }
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
                    zIndex: theme => theme.zIndex.drawer + 100
                }}
            />
          </DialogContent>
          <DialogActions>
            <Button
                onClick={onClose}
                color="primary"
            > Annuler
            </Button>
          </DialogActions>
        </Dialog>
    )
}