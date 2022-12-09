import React from 'react'

/***************************    Material UI     *****************************/
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
/****************************************************************************/


export default function BasicDialog({ open, onClose, message, onSubmit, captionAceptar, captionCancelar }) {

  return (
    <Dialog 
        open={open} 
        onClose={onClose}
        aria-describedby="alert-dialog-description"
        
    >
        <DialogContent>
            <DialogContentText id="alert-dialog-description"
            sx={{ fontSize: '1.6rem', }}>
                {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions >
            <Button sx={{ fontSize: '1.4rem', }} onClick={onSubmit} autoFocus>{captionAceptar}</Button>
            <Button sx={{ fontSize: '1.4rem', }} onClick={onClose}>{captionCancelar}</Button>
        </DialogActions>
    </Dialog>
  )
}
