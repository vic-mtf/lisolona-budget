import Box from "../../components/Box"
import _lisolonabudget_logo from '../../assets/group_speak.webp';
import { 
    CardMedia, 
    Stack,
    Box as MuiBox,
    CircularProgress,
    Divider
} from "@mui/material";
import Typography from "../../components/Typography";
import 'animate.css/source/attention_seekers/swing.css';
import _logo_geid from '../../assets/geid_logo_blue_without_title.webp';

export default function Cover ({loading}) {

    return (
        <Box
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                userSelect: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
           <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            spacing={1}
           >
            <CardMedia
                    component="img"
                    src={_lisolonabudget_logo}
                    draggable={false}
                    sx={{
                        height: 100,
                        width: 100,
                        animation: 'swing .5s 1s' ,
                    }}
            />
            <MuiBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                position="relative"
            >
                {/* <Typography fontWeight="bold" variant="h4" paragraph>
                        Lisolo na budget
                </Typography> */}
                <Stack 
                    spacing={1} 
                    direction="row" 
                    width={500} 
                    my={1}
                    divider={
                        <Divider 
                            flexItem 
                            orientation="vertical" 
                            sx={{
                                bgcolor: 'text.secondary',
                                borderRight: 2.5,
                                borderLeft: 2.5
                            }}
                        />
                    }
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
                {loading &&
                <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{position: 'absolute', top: '150%'}}
                />}
            </MuiBox>
           </Stack>
           <Typography  variant="caption" paragraph>
                Direction Archives et Nouvelles Technologie de l'Information et de la Communication ©2022
            </Typography>
        </Box>
    )
}