import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Checkbox } from '@mui/material';
import '/styles/CustomGrid.css'

function CustomDataGrid({ columns, rows, textColor = "black", backgroundColor = "white", ...props }) {
    const customStyle = {
        '& .MuiDataGrid-main': {
            color: textColor + ' !important',
            backgroundColor: backgroundColor,
            minHeight: '500px',
        },
        '& .MuiSvgIcon-root': {
            fill: textColor + ' !important',
        },
        '& .MuiToolbar-root': {
            color: textColor + ' !important',
        },
        '& .MuiDataGrid-footerContainer': {
            color: textColor + ' !important',
            backgroundColor: backgroundColor,
        },
        '& .MuiDataGrid-withBorderColor': {
            borderColor: textColor + ' !important',
        },
    }

    for (var i = 0; i < rows.length; i++) {
        rows[i]['checkbox'] = <Button variant="contained" color="primary">Primary</Button>
    }


    return (
        <div className='datagrid-container'>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                sx={customStyle}
                {...props}
            />
        </div>
    );
}

export default CustomDataGrid;