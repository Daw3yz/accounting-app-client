'use client'

import React from "react"
import '/src/app/globals.css'
import { CircularProgress, Box } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'
import TransactionPageForm from "/components/transactionPageForm.js";
import { useEffect, useLayoutEffect } from "react";
import qs from "qs";



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
                const recordData = response.data.find((record) => record.id == params.id)
                const recordDataProcessed = {
                    'id': recordData.id,
                    'userTo': recordData.userTo.id,
                    'amount': recordData.amount,
                    'notes': recordData.notes,
                }
                console.log(recordData)
                if (defaults.id != recordDataProcessed.id) {
                    setDefaults(recordDataProcessed)
                }
            }).catch((error) => {

            });
    })

    async function handleSaveButtonClick(formData) {
        var formDataJson = {}
        for (var [key, value] of formData.entries()) {
            formDataJson[key] = value
        }
        formDataJson['id'] = params.id
        var formDataString = qs.stringify(formDataJson)
        var config = {
            method: 'post',
            url: serverUrl + '/transactions/write',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'token': localStorage.getItem("token")
            },
            data: formDataString
        };

        axios(config)
            .then((response) => {
                console.log("EDIT SUCCESSFUL")

            })
            .catch((error) => {
                throw error
            });
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
        <TransactionPageForm isEditPage={true} handleSaveButtonClick={handleSaveButtonClick} defaults={defaults} />
    )
}