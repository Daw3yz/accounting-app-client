'use client'
import { VerifyUser, UserContext } from "/components/verifyUser"
import { Navbar } from "/components/navbar"
import React from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import axios from "axios"

const theme = createTheme({
    palette: {
        primary: {
            main: "#32d66d",
        },
        secondary: {
            main: '#282c34',
            darker: '#181a1f'
        },
        background: {
            main: "rgb(27, 27, 27)",
            darker: "rgb(20, 20, 20)",
        }
    },
});

export default function CurrentLayout({ children }) {
    const [isLoading, setIsLoading] = React.useState(true)
    const [currentUser, setCurrentUser] = React.useState({})

    React.useLayoutEffect(() => {
        setIsLoading(false)
    })

    React.useEffect(() => {
        var config = {
            method: 'get',
            url: process.env.NEXT_PUBLIC_SERVER_URL + '/users/getCurrentUser',
            headers: {
                'token': localStorage.getItem("token")
            }
        };

        axios(config)
            .then((response) => {
                setCurrentUser(response.data[0])
            })
            .catch((error) => {
                console.log(error)
            });
    }, [])



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

        <UserContext.Provider value={currentUser}>
            <VerifyUser currentUser={currentUser} />
            {Object.keys(currentUser).length > 1 &&
                <div className="HomePage-header">
                    <Navbar pageTitle="Home" >
                        {children}
                    </Navbar>

                </div>
            }
        </UserContext.Provider>
    </ThemeProvider>)
}