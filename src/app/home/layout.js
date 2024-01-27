'use client'
import { VerifyUser } from "/components/verifyUser"
import { Navbar } from "/components/navbar"
import React from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: "#32d66d",
        },
        secondary: {
            main: '#ffffff',
        },
    },
});

export default function CurrentLayout({ children }) {
    return (<ThemeProvider theme={theme}>
        <VerifyUser />
        <div className="HomePage-header">
            <Navbar pageTitle="Home" >
                {children}
            </Navbar>

        </div>
    </ThemeProvider>)
}