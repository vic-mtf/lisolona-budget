import { Stack, Box as MuiBox } from "@mui/material";
import VideoCam from "./VideoCam";
import Header from "./Header";
import FooterOptions from "../../home/checking/FooterOptions";
import Footer from "./Footer";
import Typography from "../../../components/Typography";
import { useMeetingData } from "../../../utils/MeetingProvider";
import { useMemo } from "react";

export default function PrepareDevice () {
    const [{meetingData}] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);

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
            px={1}
            py={1}
        >
            <Header/>
            <Typography
                variant="h6"
            >{target.name}</Typography>
            <Typography
                maxWidth={600}
            >
                Pour une expérience de vidéoconférence fluide, 
                veuillez vérifier vos paramètres de caméra et de 
                microphone avant de commencer la réunion.
            </Typography>
            <VideoCam/>
            <FooterOptions/>
            <Footer/>
        </Stack>
    )
}