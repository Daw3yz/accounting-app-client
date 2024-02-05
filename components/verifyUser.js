'use client'
import { useRouter } from 'next/navigation'
import React from "react"
import { useEffect } from "react"
import axios from "axios"



export function VerifyUser() {
    const router = useRouter()


    useEffect(() => {
        if (localStorage.getItem("token")) {
            try {
                var config = {
                    method: 'get',
                    url: process.env.NEXT_PUBLIC_SERVER_URL + '/users/getCurrentUser',
                    headers: {
                        'token': localStorage.getItem("token")
                    }
                };

                axios(config)
                    .then((response) => {
                        if (response.data[0].id) {
                        } else {
                            router.push('/login')
                        }

                    })
                    .catch((error) => {
                        router.push('/login')
                    });
            } catch (error) {
                router.push('/login')
            }
        } else {
            router.push('/login')
        }
    }, [])

    return (<></>)
}