'use client'

import React from "react"
import '/styles/FormTemplate.css'
import '/src/app/globals.css'
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert, Grid } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { CircularProgress } from '@mui/material';
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";
import { UserContext } from "/components/verifyUser"

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function AccountMovePageForm({ isEditPage, handleSaveButtonClick, defaults = {}, ...props }) {

    const router = useRouter()
    const [kasirItems, setKasirItems] = useState([]);
    const [sourceItems, setSourceItems] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [disableEverything, setDisableEverything] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userData = React.useContext(UserContext)

    const { errorDialogOpen, errorText, openErrorDialog, closeErrorDialog } = useErrorDialog();


    useEffect(() => {
        if (isEditPage) {
            setEditMode(false)
        } else {
            setEditMode(true)
        }

        var userConfig = {
            method: 'get',
            url: serverUrl + '/users/getall',
            headers: {
                'token': localStorage.getItem("token")
            },
        };

        axios(userConfig)
            .then(response => {
                if (response.data.error) {
                    openErrorDialog(response.data.error)
                }
                setKasirItems(response.data);
            })
            .catch(error => {
                openErrorDialog(error)
            });

        var contactConfig = {
            method: 'get',
            url: serverUrl + '/contact/getall',
            headers: {
                'token': localStorage.getItem("token")
            },
        };

        axios(contactConfig)
            .then(response => {
                if (response.data.error) {
                    openErrorDialog(response.data.error)
                }
                setSourceItems(response.data);
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

                <Button type="button" variant="outlined" className="green-button-outline col-span-1" disabled={isLoading} onClick={onSaveButtonClick}>
                    {editMode ? "Save" : "Edit"}
                </Button>
                <Button type="button" variant="outlined" sx={{ marginLeft: "10px" }} className="white-button-outline col-span-1 flex" onClick={() => { router.push('/home/account-move') }}>
                    Back
                </Button>
            </div>
            <form style={{ marginTop: '10px', padding: '0 0 0 0' }} className="form-main" id="form-main">

                <div className="loading-overlay" style={{ display: isLoading ? 'block' : 'none' }}>
                    <CircularProgress className="loading-progress" style={{ display: isLoading ? 'block' : 'none' }} />
                </div>
                <div className="grid grid-cols-3 gap-0">
                    {
                        userData.role == "admin" &&
                        <FormControl className="col-span-1 form-control">
                            <InputLabel id="user-select-label" className="white-select-label" sx={{ color: inputColor, top: '10px' }}>Kasir</InputLabel>
                            <Select
                                disabled={disabledEditMode || disableEverything}
                                labelId="user-select-label"
                                className={selectClass}
                                label="Kasir"
                                name="kasirId"
                                defaultValue={'kasir' in defaults ? defaults['kasir'] : ''}
                            >
                                {kasirItems.map((item) => ( // Map over the menu items
                                    <MenuItem key={item.id} value={item.id}>{item.username}</MenuItem>
                                ))}
                            </Select >
                        </FormControl>
                    }
                    <FormControl className="col-span-1 form-control">
                        <InputLabel id="user-select-label" className="white-select-label" sx={{ color: inputColor, top: '10px' }}>Source</InputLabel>
                        <Select
                            disabled={disabledEditMode || disableEverything}
                            labelId="user-select-label"
                            className={selectClass}
                            label="Source"
                            name="sourceId"
                            defaultValue={'source' in defaults ? defaults['source'] : ''}
                        >
                            {sourceItems.map((item) => ( // Map over the menu items
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select >
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <TextField name="debit" type="number" labelId="textview-label" className={textViewClass} label="Debit"
                            disabled={disabledEditMode || disableEverything} defaultValue={'debit' in defaults ? defaults['debit'] : ''}></TextField>
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <TextField name="credit" type="number" labelId="textview-label" className={textViewClass} label="Credit"
                            disabled={disabledEditMode || disableEverything} defaultValue={'credit' in defaults ? defaults['credit'] : ''}></TextField>
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