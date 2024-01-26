import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavbarComponent from '../../component/Navbar';
import { Alert, Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import LocationMarker from '../../component/MapsReader';

function DetailAbsensi ()
{
    const { tokens } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const { absenid } = useParams();
    const [ detailAbsenMasuk, setDetailAbsenMasuk ] = useState();
    const [ detailLokasiMasuk, setDetailLokasiMasuk ] = useState();
    const [ detailAbsenKeluar, setDetailAbsenKeluar ] = useState();
    const [ detailLokasiKeluar, setDetailLokasiKeluar ] = useState();
    const [ done, setDone ] = useState( undefined );
    const navigate = useNavigate();
    const handleBack = () =>
    {
        navigate( -1 )
    }

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( absenid !== undefined && tokenUser !== undefined ) {

                await fetchListAdetailAbsenMasuk();
                await fetchListAdetailAbsenKeluar();
            }
        };

        fetchData();
    }, [ absenid, tokenUser ] );

    const fetchListAdetailAbsenMasuk = () =>
    {
        axios.get( `/api/checkin_detail/${absenid}`,
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
                setDetailAbsenMasuk( res.data )
                const [ longitude, latitude ] = res.data.checkin_location
                    .match( /POINT \(([-0-9.]+) ([-0-9.]+)\)/ )
                    .slice( 1 )
                    .map( Number );
                setTimeout( () =>
                {
                    setDone( true );
                }, 2000 );
                setDetailLokasiMasuk( { longitude, latitude } );

                // console.log( res.data )
            } ).catch( err =>
            {

                // console.log( err )
            } )
    };

    const fetchListAdetailAbsenKeluar = () =>
    {
        axios.get( `/api/checkout_detail/${absenid}`,
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

                setDetailAbsenKeluar( res.data )
                const [ longitude, latitude ] = res.data.checkout_location
                    .match( /POINT \(([-0-9.]+) ([-0-9.]+)\)/ )
                    .slice( 1 )
                    .map( Number );
                setTimeout( () =>
                {
                    setDone( true );
                }, 2000 );
                setDetailLokasiKeluar( { longitude, latitude } );
            } ).catch( err =>
            {
                // console.log( err )
            } )
    };


    return (
        <>
            <NavbarComponent />
            <Container>
                <Row>
                    <Col xs={ 6 } md={ 11 }>
                        <h1 className='display-6 text-start my-2' style={ { fontFamily: 'Poppins-Light' } }>Detail Absensi</h1>
                    </Col>
                    <Col xs={ 6 } md={ 1 } className='my-auto text-end'>
                        <Button
                            onClick={ handleBack }
                            variant='btn'
                            style={ { minHeight: '50px', backgroundColor: '#696969', color: 'white', fontFamily: 'Poppins-Regular' } }
                        >
                            Kembali
                        </Button>
                    </Col>
                </Row>
            </Container>


            <Container className='mt-5'>
                <h5 className='text-center' style={ { fontFamily: 'Poppins-Regular' } }>Absen Masuk</h5>
                { !done ? (
                    <div className='text-center'>
                        <Spinner animation="border" size='lg' className='my-4' style={ { color: '#000A2E' } } />
                    </div>

                ) : (
                    <>
                        { !detailAbsenMasuk ? (
                                <Alert variant="danger" className='text-center mt-5'>
                                    <Alert.Heading style={ { fontFamily: 'Poppins-SemiBold' } }>
                                        Maaf, user ini belum melakukan absen masuk
                                    </Alert.Heading>
                                </Alert>
                        ) : (
                                    <Row className='mt-5' style={ { minHeight: '300px' } }>
                                        <Col md={ 6 } className='my-auto' style={ { fontFamily: 'Poppins-Regular' } }>
                                    <p>Waktu: { detailAbsenMasuk?.checkin_time.split( 'T' )[ 0 ] } { detailAbsenMasuk?.checkin_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }</p>
                                    <p>Keterlambatan: { detailAbsenMasuk?.late_duration }</p>
                                </Col>
                                <Col md={ 6 } className='text-center'>
                                            { !detailLokasiMasuk ? (
                                                <Alert variant="danger" style={ { minHeight: '200px' } }>
                                                    <Alert.Heading style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                        Lokasi user tidak ditemukan!
                                                    </Alert.Heading>
                                                    <p className='mt-5' style={ { fontFamily: 'Poppins-Regular' } }>
                                                        Pastikan user sebelum absen masuk menghidupkan GPS, dan menyetujui permintaan
                                                        dari Browser untuk menggunakan Lokasi Terkini.
                                                    </p>
                                                </Alert>
                                    ) : (
                                                    <LocationMarker latitude={ detailLokasiMasuk.latitude } longitude={ detailLokasiMasuk.longitude } />
                                    ) }
                                </Col>
                            </Row>
                        ) }
                    </>
                ) }
            </Container>
            <Container className='my-5'>
                <h5 className='text-center' style={ { fontFamily: 'Poppins-Regular' } }>Absen Keluar</h5>
                { !done ? (
                    <div className='text-center'>
                        <Spinner animation="border" size='lg' className='my-4' style={ { color: '#000A2E' } } />
                    </div>

                ) : (
                    <>
                        { !detailAbsenKeluar ? (
                                <Alert variant="danger" className='text-center mt-5'>
                                    <Alert.Heading style={ { fontFamily: 'Poppins-SemiBold' } }>
                                        Maaf, user ini belum melakukan absen pulang
                                    </Alert.Heading>
                                </Alert>
                            ) : (
                                    <Row className='mt-5' style={ { minHeight: '300px' } }>
                                        <Col md={ 6 } className='my-auto' style={ { fontFamily: 'Poppins-Regular' } }>
                                    <p>Waktu: { detailAbsenKeluar?.checkout_time.split( 'T' )[ 0 ] } { detailAbsenKeluar?.checkout_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }</p>
                                            <p>Pulang Awal: { detailAbsenKeluar?.early_duration }</p>
                                    <p>Lembur: { detailAbsenKeluar?.overtime_duration }</p>
                                </Col>
                                <Col md={ 6 } className='text-center'>
                                            { !detailLokasiKeluar ? (
                                                <Alert variant="danger" style={ { minHeight: '200px' } }>
                                                    <Alert.Heading style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                        Lokasi user tidak ditemukan!
                                                    </Alert.Heading>
                                                    <p className='mt-5' style={ { fontFamily: 'Poppins-Regular' } }>
                                                        Pastikan user sebelum absen keluar menghidupkan GPS, dan menyetujui permintaan
                                                        dari Browser untuk menggunakan Lokasi Terkini.
                                                    </p>
                                                </Alert>
                                    ) : (
                                                    <LocationMarker latitude={ detailLokasiKeluar.latitude } longitude={ detailLokasiKeluar.longitude } />
                                    ) }
                                </Col>
                            </Row>
                        ) }
                    </>
                ) }
            </Container>
        </>
    )
}

export default DetailAbsensi
