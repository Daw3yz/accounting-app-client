import React, { useEffect } from "react"
import '/styles/Navbar.css'
import {
    Button, Slide, List, ListItemButton, ListItemText,
    Box, Divider, Popper, MenuList, MenuItem, Fade, Paper, ClickAwayListener,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation';
import { UserContext } from "/components/verifyUser";

const routes = {
    0: { url: '/home', text: 'Home' },
    1: { url: '/home/transactions', text: 'Transactions' },
    2: { url: '/home/transactions/form', text: 'Transactions / Form' },
    3: { url: '/home/contact', text: 'Contact' },
    4: { url: '/home/contact/form', text: 'Contact / Form' },
    5: { url: '/home/account-move', text: 'Journal Entry' },
    6: { url: '/home/account-move/form', text: 'Journal Entry / Form' },
    7: { url: '/home/users', text: 'Users' },
    8: { url: '/home/users/form', text: 'Users / Form' },
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

    const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);

    const router = useRouter()
    const pathname = usePathname()

    const user = React.useContext(UserContext)

    const anchorRefAccount = React.useRef(null);

    const accountMenuItems = {
        'Logout': {
            display: (
                <><span className="material-icons navbar-icon" style={{ marginRight: "5px" }}>logout</span>Logout</>
            ),
            execute: () => {
                localStorage.removeItem('token')
                router.push('/login')
            }
        },
    }


    function openNavbarLeft(e) {
        setLeftMenuOpen(!leftMenuOpen)
    }

    function handleListItemClick(e, index) {
        setLeftMenuOpen(!leftMenuOpen)
        setSelectedIndex(index);
        router.push(routes[index]['url']);
        return
    }

    function handleAccountOnClick(e) {
        setAccountMenuOpen(true)
    }

    function handleCloseAccountMenu(event) {
        setAccountMenuOpen(false)
    }

    useEffect(() => {
        var tempPathname = pathname
        if (tempPathname.includes('/home/transactions/form')) { // For dynamic routes
            tempPathname = '/home/transactions/form'
        }
        if (tempPathname.includes('/home/contact/form')) {
            tempPathname = '/home/contact/form'
        }
        if (tempPathname.includes('/home/account-move/form')) {
            tempPathname = '/home/account-move/form'
        }
        if (tempPathname.includes('/home/users/form')) {
            tempPathname = '/home/users/form'
        }

        for (let key in routes) {
            if (routes[key]['url'] === tempPathname) {
                setSelectedIndex(key)
            }
        }
    })

    return (
        <div>
            <ThemeProvider theme={NavbarTheme}>
                <div className="navbar-main">

                    <div className="navbar-element-left">
                        <Button onClick={openNavbarLeft} variant="menu-button" type="button" className="navbar-element-child menu-button"
                            style={{ padding: "10px 10px 10px 10px" }}>
                            <span className="material-icons navbar-icon">menu</span>
                        </Button>
                    </div>

                    <div className="navbar-element-left">
                        <div className="navbar-element-child">{routes[selectedIndex]['text']}</div>
                    </div>

                    <div className="navbar-element-right">
                        <Button variant="menu-button" type="button" className="navbar-element-child menu-button"
                            style={{ padding: "10px 10px 10px 10px" }}
                            onClick={handleAccountOnClick} ref={anchorRefAccount}>
                            <span className="material-icons navbar-icon">account_circle</span>
                        </Button>
                        <Popper
                            open={accountMenuOpen}
                            anchorEl={anchorRefAccount.current}
                            role={undefined}
                            placement="bottom"
                            transition
                            disablePortal
                            style={{ zIndex: 1000 }}
                        >
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleCloseAccountMenu}>
                                            <MenuList
                                                autoFocusItem={accountMenuOpen}
                                                id="composition-menu"
                                                aria-labelledby="composition-button"
                                            >
                                                <div style={{
                                                    padding: "8px 5px 8px 5px", display: "flex", alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <span className="material-icons navbar-icon" style={{ marginRight: "5px" }}>account_circle</span>
                                                    {user.username}
                                                </div>
                                                <Divider />
                                                {Object.keys(accountMenuItems).map((key) => (
                                                    <MenuItem onClick={() => {
                                                        accountMenuItems[key]["execute"]()
                                                        handleCloseAccountMenu()
                                                    }}>{accountMenuItems[key]["display"]}</MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
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
                                        className={selectedIndex === 5 ? "menu-left-button-selected" : "menu-left-button"}
                                        onClick={(event) => handleListItemClick(event, 5)} >
                                        <ListItemText primary="Journal Entries" />
                                    </ListItemButton>
                                    <ListItemButton
                                        className={selectedIndex === 3 ? "menu-left-button-selected" : "menu-left-button"}
                                        onClick={(event) => handleListItemClick(event, 3)} >
                                        <ListItemText primary="Contacts" />
                                    </ListItemButton>
                                    <ListItemButton
                                        className={selectedIndex === 7 ? "menu-left-button-selected" : "menu-left-button"}
                                        onClick={(event) => handleListItemClick(event, 7)} >
                                        <ListItemText primary="Users" />
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