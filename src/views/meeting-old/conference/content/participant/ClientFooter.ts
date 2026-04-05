import { Chip, Box as MuiBox, ThemeProvider, createTheme } from "@mui/material";
import Typography from "../../../../../components/Typography";
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import useClientState from "../../actions/useClientState";
import WavingHand from "../../../../../components/WavingHand";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useRef, useState } from "react";
import ParticipantOptions from "./ParticipalntOptions";

export default function ClientFooter ({name, id, rootRef}) {
    const state = useClientState({id, props: ['handRaised']});
    const [anchorEl, setAnchorEl] = useState(null);
    const anchorElRef = useRef();

    return (
        <>
            <ThemeProvider
                theme={createTheme({palette: { mode: 'dark'}})}
            >
                <MuiBox
                    position="absolute"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bottom="0"
                    left="0"
                    p={1}
                >
                    <Chip
                        icon={state?.handRaised ?
                            (
                                <WavingHand
                                    fontSize="small" 
                                    sx={{ color: 'text.primary'}}
                                /> 
                            ):
                            ( 
                                <AccountBoxOutlinedIcon 
                                    fontSize="small" 
                                    sx={{ color: 'text.primary'}}
                                />
                            )
                        }
                        label={
                            <Typography 
                                component="span"
                                variant="body2"
                            >
                                {name}
                            </Typography>
                        }
                        sx={{
                            borderRadius: 1,
                            background: theme => theme.palette.background.default + '90',
                            backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                        }}
                        deleteIcon={<MoreVertOutlinedIcon/>}
                        onDelete={event =>setAnchorEl(event.currentTarget)}
                    />
                </MuiBox>
            </ThemeProvider>
            <ParticipantOptions
                anchorEl={anchorEl}
                handleClose={() => setAnchorEl(null)}
                id={id}
            />
        </>
    );
}