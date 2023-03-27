import  {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Box as MuiBox,
    Alert,
    List,
    Divider,
    Toolbar,
    useTheme,
    Slide,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../../../../../components/Button';
import InputControler from '../../../../../components/InputControler';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import useAxios from '../../../../../utils/useAxios';
import { useSelector } from 'react-redux';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import ContactsList from './ContactsList';
import KeyboardBackspaceOutlinedIcon  from '@mui/icons-material/KeyboardBackspaceOutlined';
import Typography from '../../../../../components/Typography';
import IconButton from '../../../../../components/IconButton';
import GroupForm from './GroupFom';
import { LoadingButton } from '@mui/lab';

export default function ContactListForm () {
    const [{
        open,
        mode,
        externalErrors,
        step,
        next,
    }, setValues] = useState({step: 0});
    const itemListRef = useRef([]);
    const groupTitleRef = useRef();
    const descriptionRef = useRef();

    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
   
    const { token, id } = useSelector(store => store?.user);
    const [{loading}, refresh] = useAxios({
        method: 'post',
        url: 'api/chat/room/new',
        headers: {'Authorization': `Bearer ${token}`}
    }, {manual: true});

    const handleAllowNext = (nextState)  => {
        if(next !== nextState)
            setValues(values => ({
                ...values, 
                next: nextState
            }));
    }

    const handleClose = event => {
        event?.preventDefault();
        setValues({step: 0});
        itemListRef.current = [];
        groupTitleRef.current = null;
        descriptionRef.current = null;
    };

    const handleSubmit = event => {
        event.preventDefault();
        const externalErrors = [];
        setValues(values => ({
            ...values, 
            externalErrors: undefined
        }));
        if(!groupTitleRef.current?.trim()) 
            externalErrors.push('title');
        if(!descriptionRef.current?.trim()) 
            externalErrors.push('description');
        
        if(externalErrors.length === 0) {
            const data = {
                name: groupTitleRef.current?.trim(),
                description: descriptionRef.current?.trim(),
                members: [id, ...itemListRef.current?.map(({id}) => id)],
            };
            refresh({data}).then(() => {
                handleClose();
            });
        }
        else setValues(
            values => ({
                ...values, 
                externalErrors
            })
        )
    };

    useEffect(() => {
        const root =  document.getElementById('root');
        const handleAutoOpen = event => {
            const { mode } = event.detail;
            setValues(values => ({
                ...values, 
                open: true,
                mode,
            }));
        }
        root.addEventListener(
            '_auto_open_create_group', 
            handleAutoOpen
        );
        return () => {
            root.removeEventListener(
                '_auto_open_create_group', 
                handleAutoOpen
            );
        };
    }, [])

    return (
        <React.Fragment>
            <Button 
                children="Démarrer une discussion" 
                variant="outlined"
                color="inherit"
                sx={{mx: 'auto'}}
                startIcon={<AddCommentOutlinedIcon/>}
                onClick={() => setValues(values =>({
                    ...values, 
                    open: true, 
                    mode: 'contact'
                }))}
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
                    sx: { width: 500, height: 500, overflow: 'hidden'},
                    onSubmit: handleSubmit,
                    component: 'form'
                }}
            >
                    <DialogTitle 
                        variant='h6' 
                        fontSize={18} 
                        fontWeight="bold"
                    >
                        {mode === 'contact' ? 'Liste de contacts' : 'Nouveau Lisanga'}
                    </DialogTitle>
                    <DialogContent
                        sx={{overflow: 'hidden', position: 'relative'}}
                    >
                    {mode !== "contact" && step < 1 &&
                    <Toolbar variant="dense" disableGutters>
                        {mode !== 'group' &&
                        <IconButton 
                            sx={{mr: 1}}
                            onClick={() => setValues(values => ({...values, mode: 'contact'}))}
                        >
                            <KeyboardBackspaceOutlinedIcon fontSize="small" />
                        </IconButton>}
                        <Typography
                            flexGrow={1}
                            variant="body1"
                            fontWeight="bold"
                            color="text.secondary"
                            children="Choisissez les contacts du nouveau Lisanga"
                        />
                    </Toolbar>}
                    {mode === 'contact' &&
                    <Toolbar
                        disableGutters
                        variant="dense"
                    >
                        <Button
                            startIcon={<GroupAddOutlinedIcon/>}
                            variant="outlined"
                            color="inherit"
                            sx={{mr: 1}}
                            onClick={() => setValues(values => ({...values, mode: 'semi-group'}))}
                            fullWidth
                        >
                            Créer nouveau Lisanga
                        </Button>
                        <Button
                            startIcon={<PersonAddAlt1OutlinedIcon/>}
                            variant="outlined"
                            color="inherit"
                            sx={{ml: 1}}
                            fullWidth
                            disabled
                        >
                            Inviter un contact
                        </Button>
                    </Toolbar>}
                    <MuiBox
                        display="flex"
                        overflow="hidden"
                        flexGrow={1}
                        position="relative"
                        height="100%"
                        sx={{
                            '& > *': {
                                bgcolor: 'background.paper'
                            }
                        }}
                    >
                        <Slide
                            in={step === 0}
                            timeout={transitionDuration}
                            direction="right"
                            style={{
                                transitionDelay: `${
                                    step === 0 ? transitionDuration.exit : 0
                                }ms`,
                            position: 'absolute',
                            display: 'flex',
                                flexDirection: 'column',
                                width: '100%'
                            }}
                            unmountOnExit={step === 1}
                        >
                            <div>
                                <ContactsList
                                    handleAllowNext={handleAllowNext}
                                    itemListRef={itemListRef}
                                    mode={mode}
                                    onClose={handleClose}
                                />
                            </div>
                        </Slide>
                        <Slide
                            in={step === 1}
                            direction="right"
                            timeout={transitionDuration}
                            style={{
                                transitionDelay: `${
                                    step === 1 ? transitionDuration.exit : 0
                                }ms`,
                            position: 'absolute',
                            display: 'flex',
                                flexDirection: 'column',
                                width: '100%'
                            }}
                            unmountOnExit={step === 1}
                        >
                            <div>
                                <GroupForm
                                    itemListRef={itemListRef}
                                    onClose={handleClose}
                                    groupTitleRef={groupTitleRef}
                                    descriptionRef={descriptionRef}
                                    externalErrors={externalErrors}
                                />
                            </div>
                        </Slide>
                    </MuiBox>
                </DialogContent>
                
                <DialogActions>
                    <Button
                        onClick={handleClose}
                    >Annuler</Button>
                    <React.Fragment>
    
                        {step > 0 ?
                        (
                        <React.Fragment>
                            <Button
                                variant="outlined"
                                key="_previous"
                                onClick={() => setValues(values =>  ({...values, step: 0}))}
                            >Précédent</Button>
                            <LoadingButton
                                loading={loading}
                                variant="outlined"
                                size="small"
                                sx={{textTransform: 'none'}}
                                onClick={handleSubmit}
                            >Créer Lisanga</LoadingButton>
                        </React.Fragment>
                        ) :
                        (mode !== 'contact' &&
                        <Button
                            variant="outlined"
                            key="_next"
                            disabled={!next}
                            onClick={() => setValues(values =>  ({...values, step: 1}))}
                        >Suivant</Button>
                        )}
                    </React.Fragment>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}