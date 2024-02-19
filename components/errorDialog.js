import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import React from "react"

export function useErrorDialog() {
    const [errorText, setErrorText] = React.useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

    function openErrorDialog(errorText) {
        setErrorDialogOpen(true)
        setErrorText(errorText)
    }

    function closeErrorDialog() {
        setErrorDialogOpen(false)
    }

    return { errorText, errorDialogOpen, openErrorDialog, closeErrorDialog }
}

export default function ErrorDialog({ open, title, message, handleClose }) {

    return (<>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="error-dialog-title"
        >
            <DialogTitle id="error-dialog-title" sx={{ backgroundColor: '#ff8787', color: '#4d4d4d' }}>{title}</DialogTitle>
            <DialogContent sx={{ marginTop: '20px', minWidth: '200px' }}>
                <DialogContentText id="error-dialog-description">
                    {JSON.stringify(message)}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{ color: '#ff8787' }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
    );
}