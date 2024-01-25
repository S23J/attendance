import React, { useContext, useEffect, useMemo, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import { GoInfo } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { IoPersonAdd } from "react-icons/io5";
import ModalTambahKaryawan from '../../component/Modal/ModalTambahKaryawan';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';

function DataKaryawan ()
{
    const { tokens } = useContext( AuthContext );
    const [ listUser, setListUser ] = useState( [] );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();
    const handleDetail = ( data ) =>
    {
        navigate( '/detail-karyawan/' + data.id + '/' )
    };
    const [ showAddKaryawan, setShowAddKaryawan ] = useState( false );
    const handleShowAddKaryawan = () =>
    {
        setShowAddKaryawan( true );
    }

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) fetchListUser()
    }, [ tokenUser ] );

    const fetchListUser = () =>
    {
        axios.get( `api/users/`,
            {
                headers:
                {

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                setListUser( res.data );
            } ).catch( err =>
            {

                console.log( err )
            } )
    };


    const columns = useMemo(
        () => [
            {
                header: 'Detail',
                accessorFn: row => (
                    <div >
                        <GoInfo
                            size={ 20 }
                            onClick={ () => handleDetail( row ) }
                            style={ { cursor: 'pointer' } }
                        />

                    </div>
                ),
                size: 10,
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                header: 'Username',
                accessorKey: 'username',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Nama Depan',
                accessorKey: 'first_name',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Nama Belakang',
                accessorKey: 'last_name',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },

        ],
        [],
    );

    const table = useMantineReactTable( {
        columns,
        enableDensityToggle: false,
        initialState: {
            density: 'xs',
            sorting: [
                {
                    id: 'username', //sort by age by default on page load
                    asc: true,
                },
            ],
        },
        data: listUser,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        isMultiSortEvent: () => true,
        mantineTableProps: { striped: true },
    } );



    return (
        <>
            <NavbarComponent />
            <Container>
                <Row>
                    <Col xs={ 6 } md={ 10 }>
                        <h1 className='display-6 text-center' style={ { fontFamily: 'Poppins-Light' } }>Data Karyawan</h1>
                    </Col>
                    <Col xs={ 6 } md={ 2 } className='my-auto text-end'>
                        <Button
                            onClick={ handleShowAddKaryawan }
                            variant='btn'
                            style={ { minHeight: '50px', backgroundColor: '#12B3ED', color: 'white', fontFamily: 'Poppins-Regular' } }
                        >
                            Tambah <IoPersonAdd size={ 20 } />
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Container className='mt-5'>
                <MantineReactTable
                    table={ table }
                />
            </Container>
            <ModalTambahKaryawan
                showAddKaryawan={ showAddKaryawan }
                setShowAddKaryawan={ setShowAddKaryawan }
                fetchListUser={ fetchListUser }
            />
        </>
    )
}

export default DataKaryawan
