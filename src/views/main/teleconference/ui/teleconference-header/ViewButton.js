import Button from "../../../../../components/Button";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { ThemeProvider } from "@emotion/react";
import { createTheme, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import Menu from "../../../../../components/Menu";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../../redux/teleconference";

export default function ViewButton () {
    const [open, setOpen] = useState(false);
    const anchorElRef = useRef();
    const mode = useSelector(store => store.teleconference.mode);

    return (
        <React.Fragment>
            <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                <Button
                    startIcon={<GridViewOutlinedIcon/>}
                    endIcon={<ExpandMoreOutlinedIcon/>}
                    sx={{color: 'text.primary'}}
                    onClick={() => setOpen(true)}
                    ref={anchorElRef}
                    disabled={mode !== 'on'}
                >
                Affichage
                </Button>
            </ThemeProvider>
            <ViewMenu
                onClose={() => setOpen(false)}
                open={open}
                anchorEl={anchorElRef.current}
            />
        </React.Fragment>
    );
}

const ViewMenu = ({open, onClose, anchorEl}) => {
    const {value, disabledGrid} = useSelector(store => {
        const value = store.teleconference.videoMirrorMode;
        const disabledGrid = Boolean(store.teleconference.priorityTargetId);
        return {disabledGrid, value}
    });
    const dispatch = useDispatch();
    const optionsParams = useMemo(() => {
        return {disabledGrid}
    }, [disabledGrid]);

    return (
        <Menu
            onClose={onClose}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            {viewsOptions.map((option) => (
                <MenuItem 
                    key={option.key}
                    disabled={optionsParams[option.disabled]}
                    onClick={() => {
                        dispatch(addTeleconference({
                            key: 'videoMirrorMode',
                            data: option.key,
                        }));
                        onClose();
                    }}
                >
                    <ListItemIcon>
                        {value === option.key &&  <DoneOutlinedIcon/>}
                    </ListItemIcon>
                    <ListItemText
                        primary={option.label}
                    />
                </MenuItem>
            ))}
        </Menu>
    );
};

const viewsOptions = [
    {
        label: 'Afficher sur  la grille',
        key: 'grid',
        disabled: 'disabledGrid',
    },
    {
        label: 'Capture flottante',
        key: 'float',
    },
    {
        label: "Cacher la capture",
        key: 'none',
    }
];