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

export default function ContactPage() {

	const columns = [
		{
			field: 'id',
			headerName: 'ID',
			width: 90,
			type: 'number',
		},
		{
			field: 'name',
			headerName: 'Name',
			width: 150,
			type: 'string',
		},
		{
			field: 'type',
			headerName: 'Type',
			width: 150,
			type: 'string',
		},
		{
			field: 'phone',
			headerName: 'Phone',
			width: 150,
			type: 'string',
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 110,
			type: 'string',
		},
	];

	return (
		<DefaultGridPageContent apiUrl={serverUrl + '/contact'} clientUrl={'/home/contact/form/'} columns={columns} convertApiDataToColumns={(rowData) => {
			return {
				'id': rowData.id,
				'name': rowData.name,
				'type': rowData.type,
				'phone': rowData.phone,
				'email': rowData.email,
			}
		}} />
	)
}
