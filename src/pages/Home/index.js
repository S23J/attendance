import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import axios from '../../adapters/API/axios';
import NavbarComponent from '../../component/Navbar';
import AuthContext from '../../auth/Context/AuthContext';
import { RxEnter, RxExit } from "react-icons/rx";
import Swal from 'sweetalert2';
import instance from '../../adapters/API/axios';
import { useMediaQuery } from 'react-responsive';


function Home ()
{

    const { userInfo, tokens } = useContext( AuthContext );
    const [ location, setLocation ] = useState( null );
    const [ placeWork, setPlaceWork ] = useState( null )
    const tokenUser = tokens?.token;
    const isMobile = useMediaQuery( { maxWidth: 767 } );

    const handleSubmitAbsen = async ( event ) =>
    {
        event.preventDefault()
        const finaldata = {
            checkin_location: `POINT(${location?.longitude} ${location?.latitude})`,
            user: userInfo?.id,
            checkin_place: placeWork,
        }
        // console.log( finaldata )
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
            checkout_place: placeWork,
        }
        // console.log( finaldata )
        try {
            const response = await instance.post( `/api/checkout/`, finaldata,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                }
            );
            // console.log( response )
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
                    let place
                    if ( latitude > -6.160251239145104 && latitude < -6.159869915543252 && longitude > 106.85299747338759 && longitude < 106.85355317962996 ) {
                        place = "Concordia Jakarta"
                    } else if ( latitude > -7.294165632163485 && latitude < -7.2940900226567384 && longitude > 112.76080932919187 && longitude < 112.76098618914922 ) {
                        place = "Concordia Surabaya"
                    } else if ( latitude > -6.993607890824473 && latitude < -6.99291751677812 && longitude > 110.36540596798785 && longitude < 110.36578059787311 ) {
                        place = "Log F5 KEI Semarang"
                    } else if ( latitude > -6.992061149368572 && latitude < -6.991460821772807 && longitude > 110.35721449736182 && longitude < 110.35778717246941 ) {
                        place = "Blok K KEI Semarang"
                    } else if ( latitude > -7.004179415543319 && latitude < -7.00385529351418 && longitude > 110.4259625312932 && longitude < 110.426270314777 ) {
                        place = "Concordia Semarang"
                    }
                    else {
                        place = "Diluar kantor"
                    }
                    setPlaceWork( place )
                    setLocation( { latitude, longitude } );
                },
                ( error ) =>
                {
                    Swal.fire( {
                        icon: 'error',
                        title: 'Tidak dapat mendapatkan lokasi',
                        text: `${error.message}. Harap mengaktifkan lokasi pada perangkat Anda!`,
                    } );
                    // console.error( 'Error getting location:', error.message );
                }
            );
        } else {
            Swal.fire( {
                icon: 'error',
                title: 'Geolocation tidak support pada browser Anda!',
                text: `Silahkan mengganti atau update versi browser Anda!`,
            } );
            // console.error( 'Geolocation is not supported by your browser' );
        }
    }, [] );

    return (
        <>
            <NavbarComponent />
            <Container fluid className='text-center'>
                { isMobile ?
                    <h1 className='display-6' style={ { fontFamily: 'Poppins-Regular', fontSize: '35px' } }>Absensi Mobile Concordia Group</h1>
                    :
                    <h1 className='display-6' style={ { fontFamily: 'Poppins-Regular' } }>Absensi Mobile Concordia Group</h1>
                }
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
                <Container style={ { maxWidth: '700px' } }>
                    { isMobile ?
                        <p style={ { fontSize: '17px', fontFamily: 'Poppins-Medium' } }>
                            Selamat datang di Absensi Concordia Group.
                            Harap melakukan absensi pada saat masuk dan pulang bekerja.
                            Jam masuk 08:30 dan jam pulang 18:00, toleransi keterlambatan 15 menit.
                            Jika tidak melakukan absensi maka akan dianggap Alfa atau tidak masuk.
                        </p>
                        :
                        <p style={ { fontSize: '22px', fontFamily: 'Poppins-Medium' } }>
                            Selamat datang di Absensi Concordia Group.
                            Harap melakukan absensi pada saat masuk dan pulang bekerja.
                            Jam masuk 08:30 dan jam pulang 18:00, toleransi keterlambatan 15 menit.
                            Jika tidak melakukan absensi maka akan dianggap Alfa atau tidak masuk.
                        </p>
                    }
                </Container>
            </Container >
        </>
    )
}

export default Home
