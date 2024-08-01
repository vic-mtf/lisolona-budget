import { Box, Divider, Toolbar } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "../../components/Typography";
import logo from "../../assets/geid_logo_blue_without_title.webp";
import CarouselPub from "./carousel-pub/CarouselPub";
import CopyrightFooter from "../../components/CopyrightFooter";
import JoinFormMeeting from "./join-form-meeting/JoinFormMeeting";
import Panel from "./join-form-meeting/Panel";

export default function Home() {
  return (
    <Box
      overflow='hidden'
      display='flex'
      flex={1}
      gap={5}
      sx={{
        overflowY: "auto",
        flexDirection: { xs: "column", md: "row" },
        "& > div": {
          display: "flex",
          flex: 1,
          flexDirection: "column",
          minHeight: "100vh",
        },
      }}>
      <Box
        sx={{
          justifyContent: "start",
          alignItems: "start",
          background: ({ palette }) =>
            `linear-gradient(0.5turn, ${palette.background.paper},  ${palette.background.default})`,
        }}>
        <Toolbar>
          <Stack
            spacing={1}
            direction='row'
            width='100%'
            divider={
              <Divider
                flexItem
                orientation='vertical'
                sx={{
                  bgcolor: "text.secondary",
                  borderWidth: 1,
                }}
              />
            }
            display='flex'>
            <img src={logo} style={{ width: 100 }} alt='geid-logo' />
            <Typography noWrap variant='h5'>
              Lisolo Na Budget
            </Typography>
          </Stack>
        </Toolbar>
        <Box
          p={2}
          gap={2}
          display='flex'
          flexDirection='column'
          sx={{ pt: { xs: 8, md: 24 } }}>
          <Panel />
          <JoinFormMeeting />
        </Box>
      </Box>
      <Box
        sx={{
          justifyContent: {
            xs: "start",
            md: "center",
          },
        }}>
        <CarouselPub />
        <CopyrightFooter />
      </Box>
    </Box>
  );
}

export const CHANNEL = document.createElement("div");
