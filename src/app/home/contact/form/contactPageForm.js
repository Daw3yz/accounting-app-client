'use client'

import React from "react"
import '/styles/FormTemplate.css'
import '/src/app/globals.css'
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { CircularProgress } from '@mui/material';
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function ContactPageForm({ isEditPage, handleSaveButtonClick, defaults = {}, ...props }) {

    const router = useRouter()
    const [typeItems, setTypeItems] = useState([]);
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

        axios.get(`${serverUrl}/contact/getcontacttypes`)
            .then(response => {
                if (response.data.error) {
                    openErrorDialog(response.data.error)
                }
                setTypeItems(response.data);
            })
            .catch(error => {
                openErrorDialog(error)
            });
    }, []);

    function onSaveButtonClick(e) {
        if (editMode) {
            var formData = new FormData(document.getElementById("form-main"))
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
            <div style={{ display: "flex" }}>

                <Button type="button" variant="outlined" className="green-button-outline col-span-1" onClick={onSaveButtonClick} disabled={isLoading}>
                    {editMode ? "Save" : "Edit"}
                </Button>
                <Button type="button" variant="outlined" sx={{ marginLeft: "10px" }} className="white-button-outline col-span-1" onClick={() => { router.push('/home/contact') }}>
                    Back
                </Button>
            </div>
            <form style={{ marginTop: '10px', padding: '0 0 0 0' }} className="form-main" id="form-main">

                <div className="loading-overlay" style={{ display: isLoading ? 'block' : 'none' }}>
                    <CircularProgress className="loading-progress" style={{ display: isLoading ? 'block' : 'none' }} />
                </div>
                <div className="grid grid-cols-4 gap-0">

                    <FormControl className="col-span-1 form-control">
                        <TextField name="name" type="string" labelId="textview-label" className={textViewClass} label="Name"
                            disabled={disabledEditMode || disableEverything} defaultValue={'name' in defaults ? defaults['name'] : ''}></TextField>
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <InputLabel id="type-select-label" sx={{ color: inputColor, top: '10px' }}>Type</InputLabel>
                        <Select
                            disabled={disabledEditMode || disableEverything}
                            labelId="type-select-label"
                            className={selectClass}
                            label="type"
                            name="type"
                            defaultValue={'type' in defaults ? defaults['type'] : ''}
                        >
                            {typeItems.map((item) => ( // Map over the menu items
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))}
                        </Select >
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <TextField name="phone" labelId="textview-label" className={textViewClass} label="Phone"
                            disabled={disabledEditMode || disableEverything} defaultValue={'phone' in defaults ? defaults['phone'] : ''}></TextField>
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <TextField name="email" labelId="textview-label" className={textViewClass} label="Email"
                            disabled={disabledEditMode || disableEverything} defaultValue={'email' in defaults ? defaults['email'] : ''}></TextField>
                    </FormControl>
                </div>
            </form>
        </div >

    )
}