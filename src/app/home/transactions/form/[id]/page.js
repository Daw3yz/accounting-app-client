'use client'

import React from "react"
import '/src/app/globals.css'
import { CircularProgress, Box } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'
import TransactionPageForm from "/components/transactionPageForm.js";
import { useEffect, useLayoutEffect } from "react";


const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function EditTransactionPage({ params }) {

    const router = useRouter()
    const [errorText, setErrorText] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [defaults, setDefaults] = React.useState({});

    useLayoutEffect(() => {
        var config = {
            method: 'get',
            url: process.env.NEXT_PUBLIC_SERVER_URL + '/transactions/getAll',
            headers: {
                'token': localStorage.getItem("token")
            }
        };

        axios(config)
            .then((response) => {
                setIsLoading(false)
                console.log(response.data)
                setDefaults
            }).catch((error) => {

            });
    })

    async function handleSaveButtonClick(e, index) {
        console.log(params.id)
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
                <CircularProgress style={{ width: "50px", height: "50px", color: "#32d66d" }} />
            </div>
        )
    }

    return (
        <TransactionPageForm isEditPage={true} handleSaveButtonClick={handleSaveButtonClick} />
    )
}