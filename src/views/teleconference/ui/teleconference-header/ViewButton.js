import Button from "../../../../components/Button";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

export default function ViewButton () {
    return (
        <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
            <Button
                startIcon={<GridViewOutlinedIcon/>}
                endIcon={<ExpandMoreOutlinedIcon/>}
                disabled
                sx={{
                    color: 'text.primary'
                }}
            >
            Affichage
            </Button>
        </ThemeProvider>
    )
}