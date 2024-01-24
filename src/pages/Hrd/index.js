import React, { useContext, useEffect, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { Button, Col, Container, Row } from 'react-bootstrap'
import AuthContext from '../../auth/Context/AuthContext';
import { RxEnter, RxExit } from "react-icons/rx";
import axios from '../../adapters/API/axios';
import Swal from 'sweetalert2';

function Hrd ()
{
    const { userInfo, tokens } = useContext( AuthContext );
    const [ location, setLocation ] = useState( null );
    const tokenUser = tokens?.token;


    const handleSubmitAbsen = async ( event ) =>
    {
        event.preventDefault()
        const finaldata = {
            checkin_location: `POINT(${location?.longitude} ${location?.latitude})`,
            user: userInfo?.id,
        }
        // console.log( finaldata )
        try {
            const response = await axios.post( `/api/checkin/`, finaldata,
                {
                    headers: {
                        Authorization: `Token ` + tokenUser,
                    },
                }
            );
            Swal.fire( {
                icon: 'success',
                title: 'Absensi Masuk Berhasil',
                showConfirmButton: false,
                timer: 2000
            } )

        } catch ( err ) {
            console.log( err )
        }
    }

    const handleSubmitKeluar = async ( event ) =>
    {
        event.preventDefault()
        const finaldata = {
            checkin_location: `POINT(${location?.longitude} ${location?.latitude})`,
            user: userInfo?.id,
        }
        // console.log( finaldata )
        try {
            const response = await axios.post( `/api/checkout/`, finaldata,
                {
                    headers: {
                        Authorization: `Token ` + tokenUser,
                    },
                }
            );
            Swal.fire( {
                icon: 'success',
                title: 'Absensi Keluar Berhasil',
                showConfirmButton: false,
                timer: 2000
            } )

        } catch ( err ) {
            console.log( err )
        }
    }


    useEffect( () =>
    {
        // Check if the Geolocation API is available
        if ( 'geolocation' in navigator ) {
            navigator.geolocation.getCurrentPosition(
                ( position ) =>
                {
                    const { latitude, longitude } = position.coords;
                    setLocation( { latitude, longitude } );
                },
                ( error ) =>
                {
                    console.error( 'Error getting location:', error.message );
                }
            );
        } else {
            console.error( 'Geolocation is not supported by your browser' );
        }
    }, [] );

    // console.log( location )

    return (
        <>
            <NavbarComponent />
            <Container fluid className='text-center'>
                <h1 className='display-6' style={ { fontFamily: 'Poppins-Regular' } }>Absensi Mobile Concordia Group</h1>
                <h3 style={ { fontFamily: 'Poppins-Light' } }>Selamat Datang, { userInfo?.first_name } { userInfo?.last_name }</h3>
                <div className='mt-5'>
                    <Row >
                        <Col md={ 6 } className='mb-5'>
                            <Button variant='btn' className='btnAction btnAction-3' onClick={ handleSubmitAbsen }>
                                <Row className=' mt-2'>
                                    <Col xs={ 6 } lg={ 6 } className='text-end'>
                                        <RxEnter size={ 75 } />
                                    </Col>
                                    <Col className='my-auto text-start'>
                                        <p className='pt-2'>
                                            Absen
                                            <br />
                                            <span> Masuk</span>
                                        </p>
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                        <Col md={ 6 } className='mb-5'>
                            <Button variant='btn' className='btnAction btnAction-1' onClick={ handleSubmitKeluar }>
                                <Row className=' mt-2'>
                                    <Col xs={ 6 } lg={ 6 } className='text-end'>
                                        <RxExit size={ 75 } />
                                    </Col>
                                    <Col className='my-auto text-start'>
                                        <p className='pt-2'>
                                            Absen
                                            <br />
                                            <span> Keluar</span>
                                        </p>
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                    </Row>
                </div>
                <Container >
                    <p>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                    </p>
                </Container>

            </Container>
        </>
    )
}

export default Hrd
