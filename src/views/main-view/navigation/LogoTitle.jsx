import { Divider, Stack } from "@mui/material";
import Typography from "../../../components/Typography";
import geid_logo from "../../../assets/geid_logo_white_without_title.webp";

export default function LogoTitle() {
  return (
    <Stack
      direction='row'
      justifyContent='center'
      alignItems='center'
      spacing={1}
      divider={
        <Divider
          orientation='vertical'
          variant='middle'
          sx={{ bgcolor: "text.primary" }}
        />
      }
      height='50%'>
      <img
        alt='geid-logo'
        src={geid_logo}
        style={{ width: 80, objectFit: "contain", display: "block" }}
      />
      <Typography
        flexGrow={1}
        fontSize={18}
        variant='h6'
        fontWeight={400}
        noWrap
        component='div'
        letterSpacing={1}
        color='text.primary'>
        Lisolo Na Budget
      </Typography>
    </Stack>
  );
}
