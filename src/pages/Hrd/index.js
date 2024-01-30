import React, { useContext, useEffect, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { Button, Col, Container, Row } from 'react-bootstrap'
import AuthContext from '../../auth/Context/AuthContext';
import { RxEnter, RxExit } from "react-icons/rx";
import axios from '../../adapters/API/axios';
import Swal from 'sweetalert2';
import instance from '../../adapters/API/axios';

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

        try {
            const response = await instance.post( `/api/checkin/`, finaldata,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
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
            if ( !err?.response ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: 'Terjadi kesalahan saat Absen Masuk',
                } )
            } else if ( err.response?.status === 400 ) {
                let str = err.response?.data.error;
                let str2 = str.replace( /\[|\]|\'/g, "" );
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: str2,
                } );

            }
        }
    }

    const handleSubmitKeluar = async ( event ) =>
    {
        event.preventDefault()
        const finaldata = {
            checkout_location: `POINT(${location?.longitude} ${location?.latitude})`,
            user: userInfo?.id,
        }
        try {
            const response = await instance.post( `/api/checkout/`, finaldata,
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
            if ( !err?.response ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: 'Terjadi kesalahan saat Absen Keluar',
                } )
            } else if ( err.response?.status === 400 ) {
                let str = err.response?.data.error;
                let str2 = str.replace( /\[|\]|\'/g, "" );
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: str2,
                } );

            }
        }
    }


    useEffect( () =>
    {
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
                                            <span> Pulang</span>
                                        </p>
                                    </Col>
                                </Row>
                            </Button>
                        </Col>
                    </Row>
                </div>
                <Container style={ { maxWidth: '600px' } }>
                    <p style={ { fontSize: '20px', fontFamily: 'Poppins-Medium' } }>
                        Selamat datang di Absensi Concordia Group.
                        Harap melakukan absensi pada saat masuk dan pulang bekerja.
                        Jika tidak melakukan absensi finger print maka akan dianggap Alfa atau tidak masuk.
                    </p>
                </Container>
            </Container>
        </>
    )
}

export default Hrd
