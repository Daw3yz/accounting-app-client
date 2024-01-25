import React, { useEffect } from "react"
import '/styles/Navbar.css'
import { Button, Slide, List, ListItemButton, ListItemText, Box, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation';

const routes = {
    0: { url: '/home', text: 'Home' },
    1: { url: '/home/transactions', text: 'Transactions' },
    2: { url: '/home/transactions/form', text: 'Transactions / Form' },
}

const NavbarTheme = createTheme({
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: "menu-button" },
                    style: {
                        width: "53px",
                        height: "53px",
                        lineHeight: "0",
                        minWidth: "0",
                        borderRadius: "100px",
                    }
                }
            ]
        }
    }
});

export function Navbar({ pageTitle, children }) {

    const [leftMenuOpen, setLeftMenuOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const router = useRouter()
    const pathname = usePathname()

    function openNavbarLeft(e) {
        setLeftMenuOpen(!leftMenuOpen)
    }

    function handleListItemClick(e, index) {
        setLeftMenuOpen(!leftMenuOpen)
        setSelectedIndex(index);
        router.push(routes[index]['url']);
        return
    }

    useEffect(() => {
        var tempPathname = pathname
        if (tempPathname.includes('/home/transactions/form')) {
            tempPathname = '/home/transactions/form'
        }
        switch (tempPathname) {
            case '/home':
                setSelectedIndex(0)
                break;
            case '/home/transactions':
                setSelectedIndex(1)
                break;
            case '/home/transactions/form':
                setSelectedIndex(2)
                break;
        }
    }) // Add router.isReady as a dependency

    return (
        <div>
            <ThemeProvider theme={NavbarTheme}>
                <div className="navbar-main">

                    <div className="navbar-element-left">
                        <Button onClick={openNavbarLeft} variant="menu-button" type="button" className="navbar-element-child menu-button" style={{ padding: "10px 10px 10px 10px" }}>
                            {/* <MenuIcon className="menu-icon" style={{height: "100%", width: "100%"}}></MenuIcon> */}
                            <span className="material-icons navbar-icon">menu</span>
                        </Button>
                    </div>

                    <div className="navbar-element-left">
                        <div className="navbar-element-child">{routes[selectedIndex]['text']}</div>
                    </div>

                    <div className="navbar-element-right">
                        <Button variant="menu-button" type="button" className="navbar-element-child menu-button" style={{ padding: "10px 10px 10px 10px" }}>
                            <span className="material-icons navbar-icon">account_circle</span>
                        </Button>
                    </div>
                </div>

                <Slide in={leftMenuOpen} className="menu-left" direction="right">
                    <div>
                        <div className="menu-left-content">
                            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                <List component="nav" aria-label="main mailbox folders" className='menu-left-button-container'>
                                    <ListItemButton
                                        // selected={selectedIndex === 0}
                                        className={selectedIndex === 0 ? "menu-left-button-selected" : "menu-left-button"}
                                        onClick={(event) => handleListItemClick(event, 0)}>
                                        <ListItemText primary="Home" />
                                    </ListItemButton>
                                    <Divider />
                                    <ListItemButton
                                        className={selectedIndex === 1 ? "menu-left-button-selected" : "menu-left-button"}
                                        onClick={(event) => handleListItemClick(event, 1)} >
                                        <ListItemText primary="Transactions" />
                                    </ListItemButton>
                                </List>

                            </Box>
                        </div>
                    </div>
                </Slide>
                <div className="navbar-spacing"></div>
            </ThemeProvider>

            <div className={"main-content " + (leftMenuOpen && "main-content-slider-open")}>
                {children}
            </div>
        </div>
    )
}