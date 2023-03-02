import { Zoom } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "../../../../components/Typography";

export default function EmptyContentMessage ({title, description, show}) {
    return (show &&
        <Zoom in={show}>
            <Stack
                display="flex"
                justifyContent="center"
                alignItems="center"
                component="li"
                height="100%"
                width="100%"
                color="text.secondary"
                spacing={1}
                px={1}
            >
                <Typography
                    variant="h6"
                    fontWeight={100}
                >
                    {title}
                </Typography>
                <Typography 
                    align="center" 
                    color="text.secondary"
                >
                    {description}
                </Typography>
            </Stack>
        </Zoom>
    )
}