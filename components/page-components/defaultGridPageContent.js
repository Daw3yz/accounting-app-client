'use client'
import React, { useContext } from "react"
import axios from "axios";
import { useRouter } from 'next/navigation'

import { Button, TextField } from '@mui/material';

import CustomDataGrid from "/components/customGrid";
import MenuListComponent from "/components/MenuListComponent";
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";
import { useTheme } from '@mui/material/styles';
import GridFilter from "/components/gridFilter";
import { UserContext } from "/components/verifyUser";


export default function GridPage({ apiUrl, clientUrl, columns = [], convertApiDataToColumns, ...props }) {
    const [rows, setRows] = React.useState(0)
    const [selectedRows, setSelectedrows] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [filter, setFilter] = React.useState({})

    const { errorDialogOpen, errorText, openErrorDialog, closeErrorDialog } = useErrorDialog();

    const router = useRouter()
    const theme = useTheme()
    const user = useContext(UserContext)

    convertApiDataToColumns = convertApiDataToColumns ? convertApiDataToColumns : (rowData) => {
        for (ele in columns) {
            let res = {}
            res[ele[field]] = rowData[ele['field']]
        }
    }

    const menuItems = {
        'Delete': () => {
            var config = {
                method: 'post',
                url: apiUrl + '/delete',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': localStorage.getItem("token")
                },
                data: { ids: selectedRows }
            };

            axios(config)
                .then((response) => {
                    if (response.data && response.data.error) {
                        openErrorDialog(response.data.error)
                    }
                    getRowValues()

                })
                .catch((error) => {
                    // console.log(error)
                    openErrorDialog(error)
                    getRowValues()
                    // throw error
                });
        },
        'Reload Grid': () => {
            getRowValues()
        }
    }

    if (props.extraActionItems) {
        for (let key in props.extraActionItems) {
            menuItems[key] = () => {

                props.extraActionItems[key](selectedRows)
                    .then((response) => {
                        if (response.data && response.data.error) {
                            openErrorDialog(response.data.error)
                        }
                        getRowValues()

                    })
                    .catch((error) => {
                        openErrorDialog(error)
                        getRowValues()
                    });
            }
        }
    }

    function getRowValues() {
        setIsLoading(true)
        if (localStorage.getItem("token")) {
            var config = {
                method: 'get',
                url: apiUrl + '/getall',
                headers: {
                    'token': localStorage.getItem("token")
                },
                params: { where: JSON.stringify(filter) }
            };


            axios(config)
                .then((response) => {
                    if (response.data.error) {
                        openErrorDialog(response.data.error)
                    }
                    let rowsTemp = []
                    for (var i = 0; i < response.data.length; i++) {
                        let currentRow = response.data[i]
                        rowsTemp.push(convertApiDataToColumns(currentRow))
                    }
                    setRows(rowsTemp)
                    setIsLoading(false)
                }).catch((error) => {
                    setIsLoading(false)
                    openErrorDialog(error)
                })
        }
    }

    function handleOnClickCreate(e) {
        router.push(clientUrl)

    }

    function handleRowDoubleClick(params, event) {
        if (props.disableCreate) {
            return
        }
        router.push(clientUrl + params.id)
    }

    function onSelectionChange(ids) {
        setSelectedrows(ids)
    }

    React.useEffect(() => {
        getRowValues()
    }, [filter])

    return (<div className="page-content">
        <ErrorDialog open={errorDialogOpen} title="Error" message={errorText} handleClose={closeErrorDialog}></ErrorDialog>
        <div className="grid grid-cols-10 gap-3">

            <div className="col-span-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


                {!props.disableCreate ?
                    <Button variant="outlined" className="green-button-outline col-span-1" type="button" onClick={handleOnClickCreate}
                        sx={{ alignSelf: "flex-start" }}>
                        <span className="material-icons" >add</span><div >Create</div>
                    </Button> : <></>}

                <div style={{ margin: !props.disableCreate ? "0 30px 0 30px" : '0' }}>
                    <MenuListComponent menuItems={menuItems} />
                </div>

            </div>

            <div className="col-span-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <GridFilter columns={columns} setFilter={setFilter} filter={filter} />

            </div>

        </div>
        <CustomDataGrid columns={columns} rows={rows} textColor="#e8e8e8" backgroundColor={theme.palette.secondary.main}
            onRowSelectionModelChange={(ids) => onSelectionChange(ids)} checkboxSelection
            onRowDoubleClick={handleRowDoubleClick} loading={isLoading} />
    </div>)
}
