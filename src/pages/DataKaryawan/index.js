import React, { useContext, useEffect, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { Container, Table } from 'react-bootstrap'
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import { GoInfo } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

function DataKaryawan ()
{
    const { tokens, userInfo } = useContext( AuthContext );
    const [ listUser, setListUser ] = useState( [] );
    // const [ listEmployee, setLislistEmployee ] = useState( [] );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();

    const handleDetail = ( data ) =>
    {
        navigate( '/detail-karyawan/' + data.id + '/' )
    }

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) fetchListUser()
        // if ( tokenUser !== undefined ) fetchListEmployee()
        // if ( userInfo?.id !== undefined ) fetchListAbsensiKeluar()
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
                // console.log( res.data )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };

    // const fetchListEmployee = () =>
    // {
    //     axios.get( `api/employee/`,
    //         {
    //             headers:
    //             {

    //                 Authorization: `Token ` + tokenUser,
    //             },

    //         } )
    //         .then( res =>
    //         {

    //             setLislistEmployee( res.data );
    //             // console.log( res.data )
    //         } ).catch( err =>
    //         {

    //             console.log( err )
    //         } )
    // };




    return (
        <>
            <NavbarComponent />
            <h1 className='display-6 text-center'>Data Karyawan</h1>
            <Container className='mt-5'>
                <Table responsive>
                    <thead>
                        <tr className='text-center'>
                            <th>#</th>
                            <th>Detail</th>
                            <th>Username</th>
                            <th>Nama Depan</th>
                            <th>Nama Belakang</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listUser?.map( ( data, index ) =>
                            {
                                return (
                                    <tr key={ index } className='text-center'>
                                        <td>{ index + 1 }</td>
                                        <td >
                                            <GoInfo
                                                size={ 25 }
                                                onClick={ () => handleDetail( data ) }
                                                style={ { cursor: 'pointer' } }
                                            />
                                        </td>
                                        <td >
                                            { data?.username }
                                        </td>
                                        <td >
                                            { data?.first_name }
                                        </td>
                                        <td >
                                            { data?.last_name }
                                        </td>
                                    </tr>
                                )
                            } )
                        }
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default DataKaryawan
