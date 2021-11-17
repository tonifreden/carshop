import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Snackbar } from '@mui/material';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import AddCar from './AddCar';
import EditCar from './EditCar';

export default function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = url => {
        if (window.confirm("Are you sure?")) {
            fetch(url, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetchData();
                    setMsg("Car deleted");
                    setOpen(true);
                } else {
                    alert("Delete unsuccessful")
                }
            })
            .catch(err => console.error(err));
        }
    }

    const addCar = car => {
        fetch('https://carstockrest.herokuapp.com/cars',
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(car)
            }
        )
        .then(_ => {
            fetchData();
            setMsg("Car added");
            setOpen(true);
        })
        .catch(err => console.error(err));
    }

    const editCar = (url, updatedCar) => {
        fetch(url, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(updatedCar)
        })
        .then(_ => {
            fetchData();
            setMsg("Car updated");
            setOpen(true);
        })
        .catch(err => console.error(err));
    }

    const columns = [
        {field: 'brand', sortable: true, filter: true},
        {field: 'model', sortable: true, filter: true},
        {field: 'color', sortable: true, filter: true},
        {field: 'fuel', sortable: true, filter: true, width: 120},
        {field: 'year', sortable: true, filter: true, width: 120},
        {field: 'price', sortable: true, filter: true, width: 120},
        {
            headerName: '',
            field: '_links.self.href',
            sortable: false,
            filter: false,
            width: 120,
            cellRendererFramework: params => <Button size="small" color="error" onClick={() => deleteCar(params.value)}>Delete</Button>
        },
        {
            headerName: '',
            field: '_links.self.href',
            sortable: false,
            filter: false,
            width: 120,
            cellRendererFramework: params => <EditCar editCar={editCar} car={params} />
        }
    ]

    return (
        <div>
            <AddCar addCar={addCar} />
            <div className="ag-theme-material" style={{marginTop: 20, height: 600, width: '90%', margin: 'auto'}}>
                <AgGridReact
                    columnDefs={columns}
                    rowData={cars}
                    pagination={true}
                    paginationPageSize={9}
                    suppressCellSelection={true}
                />
            </div>
            <Snackbar
                open={open}
                message={msg}
                autoHideDuration={3000}
                onClose={handleClose}
            />
        </div>
    );
}