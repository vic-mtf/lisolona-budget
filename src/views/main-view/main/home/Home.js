import { Toolbar, Stack, Divider, Chip } from "@mui/material";
import Box from "../../../components/Box";
import Typography from "../../../components/Typography";
// import _logo_geid from "../../../assets/geid_logo_blue_without_title.webp";

export default function Home() {
  return (
    <Box sx={{ display: { xs: "none", md: "flex" } }}>
      <Box
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        px={2}>
        <Toolbar variant='dense' />
        <Chip
          variant='outlined'
          label='Veuillez sélectionner une conversation pour entamer une discussion.'
          sx={{ mt: 4 }}
        />
      </Box>
      <Stack
        display='flex'
        direction='row'
        alignItems='center'
        justifyContent='center'
        spacing={3}
        my={1}
        divider={<Divider flexItem orientation='vertical' variant='middle' />}>
        {/* <Typography variant="caption" children="Ministère Du Budget" />
                <Typography variant="caption" children="Secretariat Général" /> */}
        <Typography
          color='text.secondary'
          variant='caption'
          children="Direction Archives et Nouvelles Technologie de l'Information et de la Communication &copy;2022"
        />
      </Stack>
      {/* <Stack 
                height={5} 
                display="flex" 
                direction="row" 
            >
                <Box flex={1} bgcolor="#0095c9" />
                <Box flex={1} bgcolor="#fff24b" />
                <Box flex={1} bgcolor="#db3832" />
            </Stack> */}
    </Box>
  );
}
