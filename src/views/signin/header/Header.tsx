import { Box, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import geidLogoBlue from "@/assets/geid_logo_blue.webp";
import geidLogoWhite from "@/assets/geid_logo_white.webp";

export default function Header() {
  const theme = useTheme();
  const srcLogo = useMemo(
    () => (theme.palette.mode === "dark" ? geidLogoWhite : geidLogoBlue),
    [theme.palette.mode]
  );

  return (
    <Box>
      <Box
        component="img"
        src={srcLogo}
        srcSet={srcLogo}
        width="80%"
        draggable={false}
        sx={{ userSelect: "none" }}
      />
      <Typography align="center" variant="h6" paragraph>
        Authentification
      </Typography>
    </Box>
  );
}
