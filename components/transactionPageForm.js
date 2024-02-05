'use client'

import React from "react"
import '/styles/TransactionForm.css'
import '/src/app/globals.css'
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { CircularProgress } from '@mui/material';
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function TransactionPageForm({ isEditPage, handleSaveButtonClick, defaults = {}, ...props }) {

    const router = useRouter()
    const [menuItems, setMenuItems] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [disableEverything, setDisableEverything] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { errorDialogOpen, errorText, openErrorDialog, closeErrorDialog } = useErrorDialog();


    useEffect(() => {
        if (isEditPage) {
            setEditMode(false)
        } else {
            setEditMode(true)
        }

        axios.get(`${serverUrl}/users/getall`)
            .then(response => {
                if (response.data.error) {
                    openErrorDialog(response.data.error)
                }
                setMenuItems(response.data);
            })
            .catch(error => {
                openErrorDialog(error)
            });
    }, []);

    function onSaveButtonClick(e) {
        if (editMode) {
            var formData = new FormData(document.getElementById("transaction-form"))
            setIsLoading(true)
            handleSaveButtonClick(formData).then((response) => {
                setIsLoading(false)
                if (response.data.error) {
                    openErrorDialog(response.data.error)
                }
            }
            ).catch((error) => {
            })
            setEditMode(!editMode)
        } else {
            setEditMode(!editMode)
        }
    }

    const inputColor = editMode ? 'white' : 'grey';
    const textViewClass = inputColor + '-textview';
    const selectClass = inputColor + '-select';
    const disabledEditMode = editMode ? false : true;

    return (
        <div className="page-content">
            <ErrorDialog open={errorDialogOpen} title="Error" message={errorText} handleClose={closeErrorDialog}></ErrorDialog>
            <div className="grid grid-cols-10 gap-3">

                <Button type="button" variant="outlined" className="green-button-outline col-span-1" onClick={onSaveButtonClick}>
                    {editMode ? "Save" : "Edit"}
                </Button>
                <Button type="button" variant="outlined" className="white-button-outline col-span-1" onClick={() => { router.push('/home/transactions') }}>
                    Back
                </Button>
            </div>
            <form style={{ marginTop: '10px', padding: '0 0 0 0' }} className="transaction-form" id="transaction-form">

                <div className="loading-overlay" style={{ display: isLoading ? 'block' : 'none' }}>
                    <CircularProgress className="loading-progress" style={{ display: isLoading ? 'block' : 'none' }} />
                </div>
                <div className="grid grid-cols-3 gap-0">
                    <FormControl className="col-span-1 form-control">
                        <InputLabel id="user-select-label" sx={{ color: inputColor, top: '10px' }}>User</InputLabel>
                        <Select
                            disabled={disabledEditMode || disableEverything}
                            labelId="user-select-label"
                            className={selectClass}
                            label="User"
                            name="userToId"
                            defaultValue={'userTo' in defaults ? defaults['userTo'] : ''}
                        >
                            {menuItems.map((item) => ( // Map over the menu items
                                <MenuItem key={item.id} value={item.id}>{item.username}</MenuItem>
                            ))}
                        </Select >
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <TextField name="amount" type="number" labelId="textview-label" className={textViewClass} label="Amount"
                            disabled={disabledEditMode || disableEverything} defaultValue={'amount' in defaults ? defaults['amount'] : ''}></TextField>
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <TextField name="notes" labelId="textview-label" className={textViewClass} label="Notes"
                            disabled={disabledEditMode || disableEverything} defaultValue={'notes' in defaults ? defaults['notes'] : ''}></TextField>
                    </FormControl>
                </div>
            </form>
        </div >

    )
}