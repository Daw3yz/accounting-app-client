'use client'
import React from "react"
import axios from "axios";
import { useRouter } from 'next/navigation'

import { Button, useTheme, Dialog, TextField, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, } from '@mui/material';

import CustomDataGrid from "/components/customGrid";
import GridFilter from "/components/gridFilter";
import DefaultGridPageContent from "/components/page-components/defaultGridPageContent";
import MenuListComponent from "/components/MenuListComponent";
import ErrorDialog, { useErrorDialog } from "/components/errorDialog";



const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

export default function UserPage() {

	const [changePassDialogOpen, setChangePassDialogOpen] = React.useState(false);
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');
	const [saving, setSaving] = React.useState(false);
	const [idPasswordToChange, setIdPasswordToChange] = React.useState(null);

	const { errorDialogOpen, errorText, openErrorDialog, closeErrorDialog } = useErrorDialog();

	const theme = useTheme()

	const columns = [
		{
			field: 'id',
			headerName: 'ID',
			width: 90,
			type: 'number',
		},
		{
			field: 'username',
			headerName: 'Username',
			width: 150,
			type: 'string',
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 110,
			type: 'string',
		},
		{
			field: 'role',
			headerName: 'role',
			width: 110,
			type: 'string',
		},
	];

	const extraActionItems = {
		"Approve User": async (selectedRows) => {
			var config = {
				method: 'post',
				url: serverUrl + '/users/approve-users',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'token': localStorage.getItem("token")
				},
				data: { ids: selectedRows }
			};
			return axios(config)
		},
		"Change Password": async (selectedRows) => {
			if (selectedRows.length > 1 || selectedRows.length < 1) {
				return {
					'data': {
						'error': 'You must select one user'
					}
				}
			}
			setChangePassDialogOpen(true)
			setIdPasswordToChange(selectedRows[0])
			return {
				'data': {
					'message': ''
				}
			}
		}
	}

	const handleChangePassDialogClose = () => {
		setChangePassDialogOpen(false)
	}

	const saveChangePass = () => {
		setSaving(true)
		if (password == confirmPassword) {
			var config = {
				method: 'post',
				url: serverUrl + '/users/update-password',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'token': localStorage.getItem("token")
				},
				data: {
					'password': password,
					'id': idPasswordToChange
				}
			};
			axios(config)
				.then((response) => {
					if (response.data.error) {
						openErrorDialog(response.data.error)
					}
					setSaving(false)
					setChangePassDialogOpen(false)
				})
				.catch((error) => {
					openErrorDialog(error)
					setSaving(false)
				});
		}
		else {
			setSaving(false)
		}
	}

	return (
		<>
			<ErrorDialog open={errorDialogOpen} title="Error" message={errorText} handleClose={closeErrorDialog} />
			<Dialog
				open={changePassDialogOpen}
				onClose={handleChangePassDialogClose}
				aria-labelledby="change-pass-dialog-title"
			>
				<DialogTitle id="change-pass-dialog-title"
					sx={{ backgroundColor: theme.palette.primary.main, color: '#4d4d4d' }}>
					Change Password</DialogTitle>
				<DialogContent sx={{ paddingTop: '10px !important', minWidth: '200px', backgroundColor: theme.palette.secondary.main }}>
					<DialogContentText id="error-dialog-description" className="grid grid-cols-2 gap-3">
						<div className="col-span-2" style={{ color: saving ? theme.palette.secondary.main : "#ff8787", minHeight: '24px' }}>
							{saving ? 'Saving...' : (password == confirmPassword ? '' : 'Passwords do not match')}
						</div>
						<TextField type="password" label="Password" className="white-textview" value={password}
							onChange={(e) => {
								setPassword(e.target.value)
							}} />
						<TextField type="password" label="Confirm Password" className="white-textview" value={confirmPassword}
							onChange={(e) => {
								setConfirmPassword(e.target.value)
							}}
						/>
					</DialogContentText>
				</DialogContent>
				{/* <Divider /> */}
				<DialogActions sx={{ backgroundColor: theme.palette.secondary.main }}>
					<Button onClick={saveChangePass} sx={{ color: theme.palette.primary.main }}>
						Save
					</Button>
					<Button onClick={handleChangePassDialogClose} sx={{ color: theme.palette.primary.main }}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
			<DefaultGridPageContent apiUrl={serverUrl + '/users'} clientUrl={'/home/users/form/'} columns={columns} disableCreate
				convertApiDataToColumns={(rowData) => {
					return {
						'id': rowData.id,
						'username': rowData.username,
						'role': rowData.role,
						'email': rowData.email,
					}
				}} extraActionItems={extraActionItems} />
		</>
	)
}
