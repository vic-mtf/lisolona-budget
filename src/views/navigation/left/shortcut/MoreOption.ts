import { CardContent, Menu } from '@mui/material';

export default function MoreOption ({anchorEl, onClose}) {
    return (
        <Menu 
            anchorEl={anchorEl} 
            keepMounted 
            open={Boolean(anchorEl)} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    bgcolor: theme => theme.palette.background.paper + 
                    theme.customOptions.opacity,
                    border: theme => `1px solid ${theme.palette.divider}`,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    height: 200,
                    width: 200,
                    overflow: 'auto',
                }
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            // transformOrigin={{
            //     vertical: 'top',
            //     horizontal: 'letf',
            // }}
        >
          <CardContent component="div">
          </CardContent>
        </Menu>
    );
}