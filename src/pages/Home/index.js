import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap'
import LocationMarker from '../../component/MapsReader';
import axios from '../../adapters/API/axios';
import NavbarComponent from '../../component/Navbar';
import AuthContext from '../../auth/Context/AuthContext';
import { RxEnter, RxExit } from "react-icons/rx";
import Swal from 'sweetalert2';


function Home ()
{
    // const [ absensiMasuk, setAbsensiMasuk ] = useState( [] );
    // const [ absensiKeluar, setAbsensiKeluar ] = useState( [] );
    const { userInfo, tokens } = useContext( AuthContext );
    const [ location, setLocation ] = useState( null );
    const tokenUser = tokens?.token;
    // console.log( tokenUser )
    // const latitude = -6.159857024912272;
    // const longitude = 106.85345376707144;

    // const fetchListAbsensiMasuk = () =>
    // {
    //     axios.get( `/api/checkin/`,
    //         {
    //             headers:
    //             {
    //                 withCredentials: true,
    //                 Authorization: `Token 40978b40504826c91e95027d7789f8d42bf4fa32`,
    //             },

    //         } )
    //         .then( res =>
    //         {
    //             // Modify the data structure to include latitude and longitude properties
    //             const modifiedData = res.data.map( item =>
    //             {
    //                 const [ longitude, latitude ] = item.checkin_location
    //                     .match( /POINT \(([-0-9.]+) ([-0-9.]+)\)/ )
    //                     .slice( 1 )
    //                     .map( Number );

    //                 return {
    //                     ...item,
    //                     latitude,
    //                     longitude,
    //                 };
    //             } );
    //             setAbsensiMasuk( modifiedData );
    //             // console.log( res.data )
    //         } ).catch( err =>
    //         {

    //             console.log( err )
    //         } )
    // };

    // useEffect( () =>
    // {
    //     fetchListAbsensiMasuk()
    // }, [] );

    // const fetchListAbsensiKeluar = () =>
    // {
    //     axios.get( `/api/checkout/`,
    //         {
    //             headers:
    //             {
    //                 withCredentials: true,
    //                 Authorization: `Token 40978b40504826c91e95027d7789f8d42bf4fa32`,
    //             },

    //         } )
    //         .then( res =>
    //         {
    //             // Modify the data structure to include latitude and longitude properties
    //             const modifiedData = res.data.map( item =>
    //             {
    //                 const [ longitude, latitude ] = item.checkout_location
    //                     .match( /POINT \(([-0-9.]+) ([-0-9.]+)\)/ )
    //                     .slice( 1 )
    //                     .map( Number );

    //                 return {
    //                     ...item,
    //                     latitude,
    //                     longitude,
    //                 };
    //             } );
    //             setAbsensiKeluar( modifiedData );
    //             // console.log( res.data )
    //         } ).catch( err =>
    //         {

    //             console.log( err )
    //         } )
    // };

    // useEffect( () =>
    // {
    //     fetchListAbsensiKeluar()
    // }, [] );

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
                {/* <div>
                { location ? (
                    <div>
                        <p>Latitude: { location.latitude }</p>
                        <p>Longitude: { location.longitude }</p>
                    </div>
                ) : (
                    <p>Loading location...</p>
                ) }
            </div> */}

                {/* <h3 className='mt-5'>Pantau Absensi Masuk</h3>
            <Row className='mt-5 mb-5'>
                {
                    absensiMasuk?.map( ( data, index ) =>
                    {
                        return (
                            <Col lg={ 3 } key={ index } className='mb-4'>
                                <Card>
                                    <Card.Header>
                                        <Row>
                                            <Col className='text-start my-auto'>
                                                <p>User { data?.user }</p>
                                            </Col>
                                            <Col className='text-end'>
                                                <p>
                                                    { data?.checkin_time.split( 'T' )[ 0 ] }
                                                    <br />
                                                    <span>{ data?.checkin_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }</span>
                                                </p>
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body>
                                        <p className='mb-3'>Keterlambatan: { data?.late_duration }</p>
                                        <LocationMarker latitude={ data?.latitude } longitude={ data?.longitude } />
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    } )
                }
            </Row>
            <hr />
            <h3 className='mt-5'>Pantau Absensi Keluar</h3>
            <Row className='mt-5'>
                {
                    absensiKeluar?.map( ( data, index ) =>
                    {
                        return (
                            <Col lg={ 3 } key={ index } className='mb-4'>
                                <Card>
                                    <Card.Header>
                                        <Row>
                                            <Col className='text-start my-auto'>
                                                <p>User { data?.user }</p>
                                            </Col>
                                            <Col className='text-end'>
                                                <p>
                                                    { data?.checkout_time.split( 'T' )[ 0 ] }
                                                    <br />
                                                    <span>{ data?.checkout_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }</span>
                                                </p>
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body>
                                        <p className='mb-3'>Lemburan: { data?.overtime_duration }</p>
                                        <LocationMarker latitude={ data?.latitude } longitude={ data?.longitude } />
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    } )
                }

            </Row> */}
            </Container >
        </>
    )
}

export default Home
