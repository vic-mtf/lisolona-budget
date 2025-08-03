import { Stack, Divider, Typography, Chip } from "@mui/material";
import _platform_logo from "../../../../assets/geid_logo_blue_without_title.png";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function Presentation() {
  return (
    <Stack
      display='flex'
      justifyContent='center'
      alignItems='center'
      flex={1}
      spacing={1}>
      <Stack
        spacing={1}
        direction='row'
        width={500}
        my={1}
        divider={
          <Divider
            flexItem
            orientation='vertical'
            sx={{
              bgcolor: "text.primary",
              borderWidth: 1,
            }}
          />
        }
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{
          "& > img": {
            height: {
              xs: 35,
              md: 40,
            },
          },
          "& > div": {
            fontSize: {
              xs: 25,
              md: 30,
            },
          },
        }}>
        <img alt='geid-budget' src={_platform_logo} loading='eager' />
        <Typography noWrap variant='h4'>
          Lisolo Na Budget
        </Typography>
      </Stack>
      <div>
        <Chip
          icon={
            <ArrowBackOutlinedIcon
              sx={{ animation: "slide 1.5s", animationDelay: ".5s" }}
            />
          }
          variant='outlined'
          label='Sélectionnez une discussion pour initier une conversation.'
          sx={{
            mt: 2,
            "@keyframes slide": {
              "0%": { transform: "translateX(0px)" },
              "25%": { transform: "translateX(8px)" },
              "50%": { transform: "translateX(-10px)" },
              // "75%": { transform: "translateX(6px)" },
              "100%": { transform: "translateX(0px)" },
            },
          }}
        />
      </div>
    </Stack>
  );
}
