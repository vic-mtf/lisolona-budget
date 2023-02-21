import { Toolbar, Box as MuiBox, createTheme, ThemeProvider, Stack, Divider, CardMedia } from "@mui/material";
import Box from "../../../components/Box";
import Typography from "../../../components/Typography";
import appConfig from '../../../configs/app-config.json';
import CarouselPub from "./CarouselPub";
import _logo_geid from '../../../assets/geid_logo_blue_without_title.webp';

export default function Home () {

    return (
        <Box>
          <Box
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            px={2}
          >
            <Toolbar variant="dense" />
            <CarouselPub/>
            <Stack 
                spacing={1} 
                direction="row" 
                width={500} 
                my={1}
                divider={<Divider flexItem orientation="vertical" sx={{bgcolor: 'text.secondary'}}/>}
                display="flex"
                justifyContent="center"
            >
                <CardMedia
                    component="img"
                    src={_logo_geid}
                    sx={{width: 120}}
                />
                <Typography
                    noWrap
                    variant="h4"
                    fontWeight="bold"
                >Lisolo Na Budget</Typography>
            </Stack>
            <Typography color="text.secondary">
                Un environnement digital pour collaborer 
                et innover en toute simplicité.
            </Typography>
            <Typography color="text.secondary">
                Une plateforme complète pour fluidifier la communication et 
                le travail collaboratif au ministère du budget
            </Typography>

          </Box>
          <Stack 
                display="flex" 
                direction="row" 
                alignItems="center"
                justifyContent="center"
                spacing={3}
                my={1}
                divider={<Divider flexItem orientation="vertical" variant="middle" />}
            >
                <Typography variant="caption" children="Ministère Du Budget" />
                <Typography variant="caption" children="Secretariat Général" />
                <Typography variant="caption" children="Direction Archives et Nouvelles Technologie de l'Information et de la Communication &copy;2022" />
            </Stack>
           <Stack 
                height={5} 
                display="flex" 
                direction="row" 
            >
                <Box flex={1} bgcolor="#0095c9" />
                <Box flex={1} bgcolor="#fff24b" />
                <Box flex={1} bgcolor="#db3832" />
            </Stack>
        </Box>
    )
}