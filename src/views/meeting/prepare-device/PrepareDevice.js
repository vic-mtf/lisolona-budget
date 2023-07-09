import { Stack, Box as MuiBox } from "@mui/material";
import VideoCam from "./VideoCam";
import Header from "./Header";
import FooterOptions from "../../home/checking/FooterOptions";

export default function PrepareDevice () {
    return (
        <Stack
            spacing={1}
            display="flex"  
            justifyContent="center"
            alignItems="center"
            flex={1}
            height="100%"
            width="100%"
            position="relative"
        >
            <Header/>
            <VideoCam/>
            <FooterOptions/>
        </Stack>
    )
}