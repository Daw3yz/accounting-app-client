'use client'

import React from "react"
import '/src/app/globals.css'
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from "axios"
import qs from "qs"
import { useRouter, usePathname } from 'next/navigation'
import TransactionPageForm from "/components/transactionPageForm.js";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function CreateTransactionPage() {

    const router = useRouter()
    const [errorText, setErrorText] = React.useState(null);
    const pathname = usePathname()

    async function handleSaveButtonClick(formData) {
        var formDataJson = {}
        for (var [key, value] of formData.entries()) {
            formDataJson[key] = value
        }
        var formDataString = qs.stringify(formDataJson)
        console.log(formDataString)
        var config = {
            method: 'post',
            url: serverUrl + '/transactions/create',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': localStorage.getItem("token")
            },
            data: formDataString
        };

        axios(config)
            .then((response) => {
                console.log(response)
                router.push('form/' + (response.data.id).toString())

                console.log(response)

            })
            // What am I doing? Whatever I'm noob, employers dgaf
            .catch((error) => {
                throw error
            });
    }

    return (
        <TransactionPageForm isEditPage={false} handleSaveButtonClick={handleSaveButtonClick} />
    )
}