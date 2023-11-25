import { Card, Divider, Box as MuiBox, Paper, Stack, Toolbar } from "@mui/material";
import CameraButton from "./buttons/CameraButton";
import MicroButton from "./buttons/MicroButton";
import SpeakerButton from "./buttons/SpeakerButton";
import CameraPreview from "./CameraPreview";
import MessageErrorHardware from "./MessageErrorHardware";
import { useCallback, useEffect, useRef, useState } from "react";
import AlertDeviceHardware from "./AlertDeviceHardware";


export default function HardwareTesting() {
    const [errorsArray, setErrorsArray] = useState([null, null, null]);
    const errorsRef = useRef({});
    
    const handleCheckErrors = useCallback((props={}) => {
        Object.keys(props).forEach(key => errorsRef.current[key] = props[key]);
        if(Object.values(errorsRef).length === 3)
            setTimeout(() => {
                setErrorsArray([
                    errorsRef.current.cameras,
                    errorsRef.current.micros,
                    errorsRef.current.speakers
                ]);
            }, 2000);
    },[]);

    return (
        <>
            <Card
                elevation={0}
                component={Stack}
                sx={{
                    width: {
                        xs: '100%',
                        md: '90%',
                        lg: '80%',
                    },
                    height: 400,
                    overflow: 'hidden',
                    m: 1,
                }}
                divider={<Divider />}
            >
                <MuiBox
                    position="relative"
                    display="flex"
                    flexGrow={1}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        "& > video": {
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            transform: 'scaleX(-1)'
                        }
                    }}
                >
                    <CameraPreview/>
                </MuiBox>

                <Paper
                    elevation={2}
                    sx={{
                        borderRadius: 0,
                    }}
                >
                    <Toolbar
                        variant="dense"
                        sx={{
                            justifyContent: 'center',
                        }}
                    >
                    <Stack
                            sx={{
                                border: theme => `1px solid ${theme.palette.divider}`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: .2,
                            }}
                            borderRadius={1}
                            spacing={1}
                            direction="row"
                        >
                            <CameraButton
                                handleCheckErrors={handleCheckErrors}
                            />
                            <MicroButton
                                 handleCheckErrors={handleCheckErrors}
                            />
                            <SpeakerButton
                                 handleCheckErrors={handleCheckErrors}
                            />
                        </Stack>
                    </Toolbar>
                </Paper>
            </Card>
            <MessageErrorHardware
                open={errorsArray.some(error => error === 0)}
                errorsArray={errorsArray}
            />
             <AlertDeviceHardware/>
        </>
    );
}
