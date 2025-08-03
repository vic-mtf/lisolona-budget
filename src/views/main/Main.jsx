import { CssBaseline, Box } from "@mui/material";
import Navigation from "./navigation/Navigation";
import Views from "./view-content-box/ViewContentBox";

export default function Main() {
  return (
    <Box
      display='flex'
      flex={1}
      width='100%'
      flexDirection='column'
      position='relative'
      overflow='hidden'>
      <Box sx={{ display: "flex", flex: 1, width: "100%" }}>
        <CssBaseline />
        <Navigation />
        <Views />
      </Box>
    </Box>
  );
}
