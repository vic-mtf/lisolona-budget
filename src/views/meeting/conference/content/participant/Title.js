import { Box as MuiBox } from "@mui/material";
import Typography from "../../../../../components/Typography";

export default function Title ({name}) {

    return (
        <MuiBox
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bottom="0"
            left="0"
            p={1}
        >
         <Typography 
            component="span"
            variant="body1"
            borderRadius={1}
            fontWeight="bold"
            px={1}
            sx={{
                borderRadius: 1,
                background: theme => theme.palette.background.paper + 
                theme.customOptions.opacity,
                border: theme => `1px solid ${theme.palette.divider}`,
                backdropFilter: theme => `blur(${theme.customOptions.blur})`,
            }}
        >
            {name}
         </Typography>
        </MuiBox>
    );
}