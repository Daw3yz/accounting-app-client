'use client'

import React from "react"
import '/src/app/globals.css'
import { CircularProgress } from '@mui/material';
import axios from "axios"
import UserPageForm from "../userPageForm.js";
import qs from "qs";
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";
import { useTheme } from '@mui/material/styles';


const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function EditUserPage({ params }) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [defaults, setDefaults] = React.useState({});

    const theme = useTheme()

    const { errorDialogOpen, errorText, openErrorDialog, closeErrorDialog } = useErrorDialog();

    async function handleSaveButtonClick(formData) {
        var formDataJson = {}
        for (var [key, value] of formData.entries()) {
            formDataJson[key] = value
        }
        formDataJson['id'] = params.id
        var formDataString = qs.stringify(formDataJson)
        var config = {
            method: 'post',
            url: serverUrl + '/contact/write',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': localStorage.getItem("token")
            },
            data: formDataString
        };
        const response = await axios(config)
            .catch((error) => {
                throw error
            });

        return response
    }

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: "100%",
                height: "90vh",
                padding: "30px 0 30px 0"
            }}>
                <CircularProgress style={{ width: "50px", height: "50px", color: theme.palette.primary.main }} />
            </div>
        )
    }

    return (
        <UserPageForm isEditPage={true} handleSaveButtonClick={handleSaveButtonClick} defaults={defaults} />
    )
}