import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import { Box as MuiBox } from "@mui/material";

const MicroOff = () => {
    return (
        <MuiBox
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            top="0"
            left="0"
            p={1}
        >
            <MuiBox
                borderRadius={50}
                sx={{
                    border: theme => `2px solid ${theme.palette.text.primary}`,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    px: .5,
                    py: .5,
                    width: 25,
                    height: 25,
                }}
            >
                <MicOffOutlinedIcon/>
            </MuiBox>
        </MuiBox>
    );
}

export default MicroOff;