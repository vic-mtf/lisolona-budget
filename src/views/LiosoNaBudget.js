import { CssBaseline, Box as MuiBox } from "@mui/material";
import Main from "./main/Main";
import NavigationLeft from "./navigation/left/NavigationLeft";
import Navigation from "./navigation/Navigation";
import NavigationRight from "./navigation/right/NavigationRight";

export default function Archives () {
    return (
    <MuiBox sx={{ display: 'flex', flex: 1, width: "100%"}}>
      <CssBaseline />
        <NavigationLeft/>
        <Main/>
        {/* <NavigationRight/> */}
    </MuiBox>
    )
}