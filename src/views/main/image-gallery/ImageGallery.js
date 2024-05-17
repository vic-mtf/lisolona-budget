import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
export default function ImageGallery ({ open, defaultImageIndex, onClose}) {
    

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullScreen
        >
          <DialogTitle>
            
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              
            </DialogContentText>
          </DialogContent>
          <DialogActions>
           
          </DialogActions>
        </Dialog>
    );
}