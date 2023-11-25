import React, { useEffect, useRef } from "react";
import { Backdrop, Fade, LinearProgress, Box as MuiBox } from "@mui/material";
import Typography from "../../../components/Typography";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import queryString from "query-string";
import useAxios from "../../../utils/useAxios";
import useCustomSnackbar from "../../../components/useCustomSnackbar";
import IconButton from "../../../components/IconButton";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Identify from "./Identify";
import CodeMeeting from "./CodeMeeting";

export default function CheckingCode ({setOptions, message}) {
    const location = useLocation();
    const { enqueueCustomSnackbar, closeCustomSnackbar } = useCustomSnackbar();
    const values = useMemo(() => 
        queryString.parse(location.search)?.code?.split('') || [], 
        [location]
    );
    const codeRef = useRef(values.join(''));
    const [{loading, data, error}, refetch] = useAxios({
        url: 'api/chat/room/call/' + values.join(''),
        method: 'GET',
    }, {manual: values?.length !== 9});

    useEffect(() => {
        const status = error?.request?.status;
        const {message, severity} = messages[status] || {};
        let key;
        const getKey = _key => key = _key;
        if(severity)
            enqueueCustomSnackbar({
                message, 
                severity, 
                getKey,
                action: (
                    <IconButton
                        onClick={() => closeCustomSnackbar(key)}
                    >
                        <CloseOutlinedIcon/>
                    </IconButton>
                )
            });
    },[error, enqueueCustomSnackbar, closeCustomSnackbar]);

    return (
        <React.Fragment>
            <MuiBox
                position="relative"
                width="100%"
                display="flex"
                justifyItems="center"
                alignItems="center"
            >
                <Fade
                    unmountOnExit
                    in={!data}
                    style={style}
                >
                    <MuiBox
                        display="flex"
                        gap={1}
                    >
                        <CodeMeeting
                            loading={loading}
                            values={values}
                            refetch={refetch}
                            codeRef={codeRef}
                        />
                    </MuiBox>
                </Fade>
                <Fade
                    unmountOnExit
                    in={Boolean(data)}
                    style={style}
                >
                    <MuiBox
                        display="flex"
                        gap={1}
                    >
                        <Identify
                            loading={loading}
                            values={values}
                            refetch={refetch}
                            codeRef={codeRef}
                        />
                    </MuiBox>
                </Fade>
            </MuiBox>
            <Backdrop
                open={loading}
                sx={{
                    background: theme => theme.palette.background.paper + 
                    theme.customOptions.opacity,
                }}
                children={
                    <React.Fragment>
                        <LinearProgress 
                            sx={{
                                width: '100%',
                                position: 'absolute',
                                top: 0,
                            }} 
                        />
                        {message && 
                        <Typography mt={2}>{message}</Typography>}
                    </React.Fragment>
                }
            />
        </React.Fragment>
    );
}

const messages = {
    0: {
        severity: 'warning',
        message: `
        Votre appareil n'est pas connecté à Internet. 
        Veuillez vérifier votre connexion réseau et réessayer.`
    },
    404: {
        severity: 'error',
        message: `
        Le code de la reunion entré est incorrect. 
        Veuillez vérifier et réessayer. `
    }
}

const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
};