'use client'
import { VerifyUser } from "/components/verifyUser"
import { Navbar } from "/components/navbar"
import React from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: "#32d66d",
        },
        secondary: {
            main: '#282c34',
        },
        background: {
            main: "rgb(27, 27, 27)"
        }
    },
});

export default function CurrentLayout({ children }) {
    const [isLoading, setIsLoading] = React.useState(true)

    React.useLayoutEffect(() => {
        setIsLoading(false)

    })

    if (isLoading) {

        return (
            <ThemeProvider theme={theme}>
                <div style={{
                    width: "100%",
                    height: "100vh",
                    backgroundColor: theme.palette.background.main,
                }}>
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
                </div>
            </ThemeProvider>
        )
    }


    return (<ThemeProvider theme={theme}>
        <VerifyUser />
        <div className="HomePage-header">
            <Navbar pageTitle="Home" >
                {children}
            </Navbar>

        </div>
    </ThemeProvider>)
}