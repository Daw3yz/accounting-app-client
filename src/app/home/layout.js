'use client'
import { VerifyUser } from "/components/verifyUser"
import { Navbar } from "/components/navbar"
import React from "react"

export default function CurrentLayout({ children }) {
    return (<>
        <VerifyUser />
        <div className="HomePage-header">
            <Navbar pageTitle="Home" >
                {children}
            </Navbar>

        </div>
    </>)
}