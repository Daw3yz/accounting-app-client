'use client'

import React from "react"
import '/src/app/globals.css'
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'
import TransactionPageForm from "/components/transactionPageForm.js";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function EditTransactionPage() {

    const router = useRouter()
    const [errorText, setErrorText] = React.useState(null);

    return (
        <TransactionPageForm isEditPage={true} />
    )
}