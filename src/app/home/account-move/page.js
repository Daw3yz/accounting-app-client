'use client'
import React from "react"
import axios from "axios";
import { useRouter } from 'next/navigation'

import { Button } from '@mui/material';

import CustomDataGrid from "/components/customGrid";
import GridFilter from "/components/gridFilter";
import DefaultGridPageContent from "/components/page-components/defaultGridPageContent";
import MenuListComponent from "/components/MenuListComponent";
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";



const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function AccountMovePage() {

	let columns = [
		{
			field: 'id',
			headerName: 'ID',
			width: 90,
			type: 'number',
		},
		{
			field: 'createdBy',
			headerName: 'Created By',
			width: 150,
			type: 'string',
		},
		{
			field: 'kasir',
			headerName: 'Cashier',
			width: 150,
			type: 'string',
		},
		{
			field: 'source',
			headerName: 'Source',
			width: 110,
			type: 'string',
		},
		{
			field: 'debit',
			headerName: 'Debit',
			width: 110,
			type: 'number',
		},
		{
			field: 'credit',
			headerName: 'Credit',
			width: 110,
			type: 'number',
		},
		{
			field: 'notes',
			headerName: 'Notes',
			width: 110,
			type: 'string',
		},
	];

	return (
		<DefaultGridPageContent apiUrl={serverUrl + '/account-move'} clientUrl={'/home/account-move/form/'} columns={columns} convertApiDataToColumns={(rowData) => {
			return {
				'kasir': rowData.kasir.username,
				'source': rowData.source.name,
				'id': rowData.id,
				'debit': rowData.debit,
				'credit': rowData.credit,
				'notes': rowData.notes,
				'createdBy': rowData.createdBy.username,
			}
		}} />
	)
}
