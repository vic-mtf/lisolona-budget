import { Box as MuiBox } from "@mui/material";

export default function ClientContent () {
        return (
            <MuiBox
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
            
        </MuiBox>
    );
}