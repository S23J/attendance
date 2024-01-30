import React, { useContext, useEffect, useMemo, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { Button, Col, Container, Row } from 'react-bootstrap'
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import { GoInfo, GoPencil } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { IoPersonAdd } from "react-icons/io5";
import ModalTambahKaryawan from '../../component/Modal/ModalTambahKaryawan';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import ModalEditKaryawan from '../../component/Modal/ModalEditKaryawan';
import instance from '../../adapters/API/axios';

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
    const [ showEditKaryawan, setShowEditKaryawan ] = useState( false );
    const [ selectedId, setSelectedId ] = useState()
    const handleShowEditKaryawan = ( row ) =>
    {
        setShowEditKaryawan( true );
        setSelectedId( row.id )
    }

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) fetchListUser()
    }, [ tokenUser ] );

    const fetchListUser = () =>
    {
        instance.get( `/api/users/`,
            {
                headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                setListUser( res.data );
                // fetchListGroup( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {
                // console.log( err )
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
            {
                header: 'Ubah',
                accessorFn: row =>
                {
                    // Extract the group ID of the user
                    const userGroupId = row.groups[ 0 ]; // Assuming the user has only one group

                    // Check if the user group is superuser (id: 1)
                    const isSuperuser = userGroupId === 1;

                    // Render the Edit button based on the user's group
                    return !isSuperuser ? (
                        <div>
                            <GoPencil
                                size={ 20 }
                                onClick={ () => handleShowEditKaryawan( row ) }
                                style={ { cursor: 'pointer' } }
                            />
                        </div>
                    ) : null;
                },
                size: 10,
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
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
            <ModalEditKaryawan
                showEditKaryawan={ showEditKaryawan }
                setShowEditKaryawan={ setShowEditKaryawan }
                selectedId={ selectedId }
                fetchListUser={ fetchListUser }
            />
        </>
    )
}

export default DataKaryawan
