'use client'

import React from "react"
import '/styles/TransactionForm.css'
import '/src/app/globals.css'
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function TransactionPageForm({ isEditPage, handleSaveButtonClick, defaults = {}, ...props }) {

    const router = useRouter()
    const [alertType, setAlertType] = useState(null); // ['error', 'warning', 'info', 'success'
    const [alertText, setAlertText] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (isEditPage) {
            setEditMode(false)
        } else {
            setEditMode(true)
        }



        axios.get(`${serverUrl}/users/getall`)
            .then(response => {
                setMenuItems(response.data);
            })
            .catch(error => {
                setAlertText('There was an error!');
                setAlertType('error');
            });
    }, []);

    function onSaveButtonClick(e) {
        if (editMode) {
            var formData = new FormData(document.getElementById("transaction-form"))
            handleSaveButtonClick(formData).then(() => {
                console.log("Success")
            }
            ).catch((error) => {
                console.log("Error")
                console.log(error)
            })
            setEditMode(!editMode)
        } else {
            setEditMode(!editMode)
        }
    }



    const inputColor = editMode ? 'white' : 'grey';
    const textViewClass = inputColor + '-textview';
    const selectClass = inputColor + '-select';
    const isDisabled = editMode ? false : true;


    return (
        <div className="page-content">
            <div className="grid grid-cols-10 gap-3">

                <Button type="button" variant="outlined" className="green-button-outline col-span-1" onClick={onSaveButtonClick}>
                    {editMode ? "Save" : "Edit"}
                </Button>
                <Alert variant="filled" severity="error" className="col-span-6" sx={{ display: alertText ? "box" : "none" }}>
                    {alertText}
                </Alert>
            </div>
            <form style={{ marginTop: '10px' }} className="transaction-form" id="transaction-form">
                <div className="grid grid-cols-3 gap-0">
                    <FormControl className="col-span-1 form-control">
                        <InputLabel id="user-select-label" sx={{ color: inputColor }}>User</InputLabel>
                        <Select
                            disabled={isDisabled}
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
                            disabled={isDisabled} defaultValue={'amount' in defaults ? defaults['amount'] : ''}></TextField>
                    </FormControl>
                    <FormControl className="col-span-1 form-control">
                        <TextField name="notes" labelId="textview-label" className={textViewClass} label="Notes"
                            disabled={isDisabled} defaultValue={'notes' in defaults ? defaults['notes'] : 'OtherNote'}></TextField>
                    </FormControl>
                </div>
            </form>
        </div >

    )
}