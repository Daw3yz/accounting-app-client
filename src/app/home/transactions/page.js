'use client'
import React from "react"
import axios from "axios";
import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';
import '/styles/Transactions.css'

import CustomDataGrid from "/components/customGrid";
import MenuListComponent from "/components/MenuListComponent";
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";



const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function TransactionPage() {

	const [rows, setRows] = React.useState(0)
	const [selectedRows, setSelectedrows] = React.useState([])
	const [isLoading, setIsLoading] = React.useState(false)

	const { errorDialogOpen, errorText, openErrorDialog, closeErrorDialog } = useErrorDialog();

	const router = useRouter()

	const columns = [
		{
			field: 'id',
			headerName: 'ID',
			width: 90
		},
		{
			field: 'amount',
			headerName: 'Amount',
			width: 150,
			// editable: true,
		},
		{
			field: 'userFrom',
			headerName: 'From',
			width: 150,
			// editable: true,
		},
		{
			field: 'userTo',
			headerName: 'To',
			type: 'number',
			width: 110,
			// editable: true,
		},
		{
			field: 'notes',
			headerName: 'Notes',
			type: 'number',
			width: 110,
			// editable: true,
		},
	];

	const menuItems = {
		'Delete': () => {
			var config = {
				method: 'post',
				url: serverUrl + '/transactions/delete',
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

	function getRowValues() {
		setIsLoading(true)
		if (localStorage.getItem("token")) {
			var config = {
				method: 'get',
				url: process.env.NEXT_PUBLIC_SERVER_URL + '/transactions/getAll',
				headers: {
					'token': localStorage.getItem("token")
				}
			};


			axios(config)
				.then((response) => {
					if (response.data.error) {
						openErrorDialog(response.data.error)
					}
					let rowsTemp = []
					for (var i = 0; i < response.data.length; i++) {
						let currentRow = response.data[i]
						rowsTemp.push({
							'id': currentRow.id,
							'amount': currentRow.amount,
							'userFrom': currentRow.userFrom.username,
							'userTo': currentRow.userTo.username,
							'notes': currentRow.notes,
						})
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
		router.push('/home/transactions/form')

	}

	function handleRowDoubleClick(params, event) {
		router.push('/home/transactions/form/' + params.id)
	}

	function onSelectionChange(ids) {
		setSelectedrows(ids)
	}

	React.useEffect(() => {
		getRowValues()
	}, [])

	return (<div className="page-content">
		<ErrorDialog open={errorDialogOpen} title="Error" message={errorText} handleClose={closeErrorDialog}></ErrorDialog>

		<div className="grid grid-cols-10 gap-3">
			<Button variant="outlined" className="green-button-outline col-span-1" type="button" onClick={handleOnClickCreate}>
				<span className="material-icons" >add</span><div >Create</div>
			</Button>
			<div className="col-span-8" style={{ display: 'flex', justifyContent: "center", alignContent: "center", paddingRight: "10vh" }}>
				<MenuListComponent menuItems={menuItems} />
			</div>
		</div>
		<CustomDataGrid columns={columns} rows={rows} textColor="#e8e8e8" backgroundColor='#282c34'
			onRowSelectionModelChange={(ids) => onSelectionChange(ids)} checkboxSelection
			onRowDoubleClick={handleRowDoubleClick} loading={isLoading} />
	</div>)
}
