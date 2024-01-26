'use client'
import { VerifyUser } from "/components/verifyUser"
import { Navbar } from "/components/navbar"
import { TextField, Button, Checkbox } from '@mui/material';
import '/styles/Transactions.css'
import { DataGrid, GridColDef, GridApi, GridCellValue } from '@mui/x-data-grid';
import CustomDataGrid from "/components/customGrid";
import { useEffect } from "react";
import React from "react"
import axios from "axios";
import { useRouter } from 'next/navigation'




export default function TransactionPage() {

	const [rows, setRows] = React.useState(0)
	const [selectedRows, setSelectedrows] = React.useState([])

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

	function getRowValues() {
		if (localStorage.getItem("token")) {
			try {
				var config = {
					method: 'get',
					url: process.env.NEXT_PUBLIC_SERVER_URL + '/transactions/getAll',
					headers: {
						'token': localStorage.getItem("token")
					}
				};


				axios(config)
					.then((response) => {
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
					}).catch((error) => {
						console.log(error)
					})
			} catch (error) {
				console.log("error")
			}
		}
	}

	function handleOnClickCreate(e) {
		router.push('/home/transactions/form')

	}

	function handleRowDoubleClick(params, event) {
		router.push('/home/transactions/form/' + params.id)
	}

	function onSelectionChange(ids) {
		console.log(ids)
	}


	useEffect(() => {
		getRowValues()
	}, [])

	return (<div className="page-content">
		<Button variant="outlined" className="green-button-outline" type="button" onClick={handleOnClickCreate}>
			<span className="material-icons" >add</span><div >Create</div>
		</Button>
		<CustomDataGrid columns={columns} rows={rows} textColor="#e8e8e8" backgroundColor='#282c34'
			onRowSelectionModelChange={(ids) => onSelectionChange(ids)} checkboxSelection
			onRowDoubleClick={handleRowDoubleClick} />
	</div>)
}
