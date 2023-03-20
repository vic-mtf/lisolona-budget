import { createTheme, ThemeProvider, Tooltip, useTheme } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Navigation from '../Navigation';
import appConfig from '../../../../../../configs/app-config.json'
import Typography from '../../../../../../components/Typography';
import IconButton from '../../../../../../components/IconButton';
import { useTeleconferenceUI } from '../../../TeleconferenceUI';
export default function NavigationRight ({open, children}) {
   const [,{setOpenChatBox}] = useTeleconferenceUI();
    return (
       <Navigation
          anchor="right" 
          variant="persistent" 
          open={open}
          children={children}
          toolBarProps={{
            sx: {
               bgcolor: appConfig.colors.main,
            },
            children: (
               <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                  <Tooltip title="fermer" arrow>
                     <IconButton
                        onClick={() => setOpenChatBox(false)}
                     >
                        <CloseOutlinedIcon fontSize="small"/>
                     </IconButton>
                  </Tooltip>
                  <Typography 
                     variant="h6" 
                     fontSize={18}
                     fontWeight="bold"
                     flexGrow={1}
                     ml={2}
                  >
                     Discussions
                  </Typography>
               </ThemeProvider>
            )
          }}
       />
    );
}