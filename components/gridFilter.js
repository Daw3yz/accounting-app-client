'use client'
import React from "react"

import {
    Popper, TextField, Box, ClickAwayListener,
    Fade, Paper, Button, FormControl, InputLabel, Select,
    MenuItem
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

export default function GridFilter({ filter, setFilter, columns }) {
    const [popperOpen, setPopperOpen] = React.useState(false);
    const [isRelatedEleFocused, setIsRelatedEleFocused] = React.useState(false);

    const anchorFilter = React.useRef(null)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [activeFilters, setActiveFilters] = React.useState({})
    const [columnToAdd, setColumnToAdd] = React.useState("")


    const theme = useTheme()

    const handlePopperClose = () => {
        if (!isRelatedEleFocused) {
            setPopperOpen(false);
        }
    }

    const onRelatedEleFocus = (event) => {
        setAnchorEl(anchorFilter.current)
        setPopperOpen(true)
        setIsRelatedEleFocused(true)
    }

    const onRelatedEleLossFocus = (event) => {
        setIsRelatedEleFocused(false)
    }

    const addColumn = () => {
        let newActiveFilters = { ...activeFilters }; // Create a copy of the activeFilters object
        if (columnToAdd in newActiveFilters) {
            newActiveFilters[columnToAdd].active = true;
            setActiveFilters(newActiveFilters); // Update the state with the newActiveFilters object
        }
    }

    const removeColumn = (e, columnToRemove) => {
        e.preventDefault()
        let newActiveFilters = { ...activeFilters }; // Create a copy of the activeFilters object
        if (columnToRemove in newActiveFilters) {
            newActiveFilters[columnToRemove].active = false;
            setActiveFilters(newActiveFilters); // Update the state with the newActiveFilters object
        }
    }

    const handleChangeOperator = (key, value) => {
        let newActiveFilters = { ...activeFilters }; // Create a copy of the activeFilters object
        if (key in newActiveFilters) {
            newActiveFilters[key].operator = value;
            setActiveFilters(newActiveFilters); // Update the state with the newActiveFilters object
        }
    }

    function applyFilters() {
        let res = {}
        var formData = new FormData(document.getElementById("form-filter"))
        var formDataJson = {}
        for (var [key, value] of formData.entries()) {
            formDataJson[key] = value
        }

        Object.keys(activeFilters).forEach((key) => {
            let filterValue = activeFilters[key]
            if (filterValue.active) {
                if (["number", "date"].includes(filterValue.type)) {
                    if (filterValue.operator == "between") {
                        res[key] = { [filterValue.operator]: [formDataJson[key + "-start"], formDataJson[key + "-end"]] }
                    }
                    else {
                        res[key] = { [filterValue.operator]: formDataJson[key] }
                    }
                }
                else {
                    res[key] = formDataJson[key]
                }
            }
        })

        setFilter(res)
    }

    React.useEffect(() => {
        let res = {}
        columns.forEach((ele) => {
            res[ele.field] = {
                name: ele.headerName,
                type: ele.type,
                operator: 'eq',
                active: false,
            }
        })
        setActiveFilters(res)
    }, [columns])


    let filterArray = []
    Object.keys(activeFilters).forEach((key) => {
        if (activeFilters[key].active) {
            if (activeFilters[key].type == "string") {
                filterArray.push(
                    <FormControl className="col-span-10 grid grid-cols-10 gap-1">
                        <TextField name={key} type={activeFilters[key].type} labelId="textview-label" className="white-textview col-span-9" key={key}
                            label={activeFilters[key].name} />
                        <button onClick={(e) => { removeColumn(e, key) }} className="col-span-1"><span className="material-icons" >delete_outline</span></button>
                    </FormControl>
                )
            }
            else if (activeFilters[key].type == "number" || activeFilters[key].type == "date") {
                var textFields = []
                if (['eq', 'gt', 'lt', 'gte', 'lte'].includes(activeFilters[key].operator)) {
                    textFields.push(
                        <TextField name={key} type={activeFilters[key].type} labelId="textview-label" className="white-textview col-span-6" key={key}
                            label={activeFilters[key].name} />
                    )
                } else if (activeFilters[key].operator == 'between') {
                    textFields.push(
                        <TextField name={key + "-start"} type={activeFilters[key].type} labelId="textview-label" className="white-textview col-span-3"
                            key={key + "-start"} label={activeFilters[key].name + " Start"} />
                    )
                    textFields.push(
                        <TextField name={key + "-end"} type={activeFilters[key].type} labelId="textview-label" className="white-textview col-span-3"
                            key={key + "-end"} label={activeFilters[key].name + " End"} />
                    )
                }
                filterArray.push(
                    <FormControl className="col-span-10 grid grid-cols-10 gap-1">
                        <InputLabel id={"operator-" + key} className="white-select-label">Operator</InputLabel>
                        <Select
                            onOpen={onRelatedEleFocus}
                            onClose={onRelatedEleLossFocus}
                            labelId={"operator-" + key}
                            className="col-span-3 white-select"
                            label="Operator"
                            key={"operator-" + key}
                            onChange={(e) => handleChangeOperator(key, e.target.value)}
                            MenuProps={{ PaperProps: { sx: { maxHeight: '200px' } } }}
                        >
                            < MenuItem key="eq" value="eq" >Equals</MenuItem>
                            < MenuItem key="gt" value="gt" >Greater Than</MenuItem>
                            < MenuItem key="lt" value="lt" >Less Than</MenuItem>
                            < MenuItem key="gte" value="gte" >Greater Than or Equals</MenuItem>
                            < MenuItem key="lte" value="lte" >Less Than or Equals</MenuItem>
                            < MenuItem key="between" value="between" >Between</MenuItem>

                        </Select>
                        {textFields}
                        <button onClick={(e) => { removeColumn(e, key) }} className="col-span-1"><span className="material-icons" >delete_outline</span></button>
                    </FormControl>
                )

            }

        }
    })





    return (
        <div style={{ width: "100%" }}>
            <TextField id="outlined-basic" ref={anchorFilter} label="Search" variant="outlined" className="white-textview"
                sx={{ width: "100%", maxWidth: "800px" }} value={JSON.stringify(filter)}
                onFocus={onRelatedEleFocus} onBlur={onRelatedEleLossFocus}
                InputLabelProps={{ shrink: true }}
            />

            <Popper
                open={popperOpen}
                anchorEl={anchorFilter.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                style={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper sx={{ backgroundColor: "transparent" }}>
                            <ClickAwayListener onClickAway={handlePopperClose}>
                                <Box sx={{
                                    p: 1, bgcolor: theme.palette.secondary.main, width: `${anchorEl?.offsetWidth}px`,
                                    borderRadius: "0 0 10px 0", color: "white", boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.8)"
                                }}>
                                    {/* Top Level Buttons */}
                                    <div className="grid grid-cols-2 gap-4" style={{ maxWidth: "400px" }}>
                                        <FormControl size="small" sx={{ marginBottom: "10px" }}>
                                            <InputLabel id="select-small-label" className="white-select-label">Column</InputLabel>
                                            <Select
                                                onOpen={onRelatedEleFocus}
                                                onClose={onRelatedEleLossFocus}
                                                labelId="select-small-label"
                                                id="column-select-small"
                                                className="white-select"
                                                label="Column"
                                                value={columnToAdd}
                                                onChange={(e) => setColumnToAdd(e.target.value)}
                                                MenuProps={{ PaperProps: { sx: { maxHeight: '200px' } } }}
                                            >
                                                {Object.keys(columns).map((key) => {
                                                    return (
                                                        < MenuItem key={columns[key].field} value={columns[key].field} >
                                                            {columns[key].headerName}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            id="composition-button"
                                            variant='outlined'
                                            onClick={() => {
                                                addColumn()
                                            }}
                                            sx={{ marginBottom: "10px" }}
                                        >
                                            <span className="material-icons" >add</span>
                                            Add filter
                                        </Button>
                                    </div>

                                    {/* Filter Column Section */}
                                    <form id="form-filter" style={{
                                        overflowY: "scroll", height: "200px", marginBottom: "10px",
                                        border: "1px solid " + theme.palette.secondary.darker,
                                        // borderBottom: "2px solid " + theme.palette.secondary.darker, 
                                        padding: "10px 5px 10px 5px",

                                    }}>
                                        <div className="grid grid-cols-10 gap-4">

                                            {filterArray}
                                        </div>
                                    </form>

                                    {/* Save Button */}
                                    <div className={"grid grid-cols-2 gap-4"} style={{ maxWidth: "400px" }}>
                                        <Button
                                            id="composition-button"
                                            variant='outlined'
                                            sx={{ marginBottom: "10px" }}
                                            onClick={applyFilters}
                                        >

                                            Apply Filters
                                        </Button>
                                    </div>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div >
    )
}