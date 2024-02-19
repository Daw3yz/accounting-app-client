'use client'

import React from "react"
import '/src/app/globals.css'
import axios from "axios"
import qs from "qs"
import { useRouter } from 'next/navigation'
import ContactPageForm from "./contactPageForm.js";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function CreateContactPage() {

    const router = useRouter()

    async function handleSaveButtonClick(formData) {
        var formDataJson = {}
        for (var [key, value] of formData.entries()) {
            formDataJson[key] = value
        }
        var formDataString = qs.stringify(formDataJson)


        var config = {
            method: 'post',
            url: serverUrl + '/contact/create',
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

        if (response.data.error) {
            return response
        }
        router.push('form/' + (response.data.id).toString())
    }

    return (
        <ContactPageForm isEditPage={false} handleSaveButtonClick={handleSaveButtonClick} />
    )
}