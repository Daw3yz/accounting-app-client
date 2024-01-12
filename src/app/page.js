'use client'
import React from "react"
import axios from "axios"
import { VerifyUser } from '/components/verifyUser'


export default function IndexPage() {

    return (<>
        <VerifyUser />
        <Navbar pageTitle="Home" />
    </>)
}
