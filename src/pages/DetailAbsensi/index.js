import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NavbarComponent from '../../component/Navbar';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import LocationMarker from '../../component/MapsReader';

function DetailAbsensi ()
{
    const { tokens } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const { absenid } = useParams();
    const [ detailAbsenMasuk, setDetailAbsenMasuk ] = useState();
    const [ detailAbsenKeluar, setDetailAbsenKeluar ] = useState();
    const [ done, setDone ] = useState( undefined );

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

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                const [ longitude, latitude ] = res.data.checkin_location
                    .match( /POINT \(([-0-9.]+) ([-0-9.]+)\)/ )
                    .slice( 1 )
                    .map( Number );
                setTimeout( () =>
                {
                    setDone( true );
                }, 2000 );
                setDetailAbsenMasuk( { ...res.data, longitude, latitude } );
                // setDetailAbsenMasuk( res.data )
                // console.log(  )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };

    const fetchListAdetailAbsenKeluar = () =>
    {
        axios.get( `/api/checkout_detail/${absenid}`,
            {
                headers:
                {

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                const [ longitude, latitude ] = res.data.checkout_location
                    .match( /POINT \(([-0-9.]+) ([-0-9.]+)\)/ )
                    .slice( 1 )
                    .map( Number );
                setTimeout( () =>
                {
                    setDone( true );
                }, 2000 );
                setDetailAbsenKeluar( { ...res.data, longitude, latitude } );
                // console.log( res.data )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };

    // console.log( detailAbsenMasuk )
    return (
        <>
            <NavbarComponent />
            <h1 className='display-6 text-center'>Detail Absensi</h1>
            <Container className='mt-5'>
                <h5 className='text-center'>Absen Masuk</h5>
                { !done ? (
                    <div className='text-center'>
                        <Spinner animation="border" size='lg' className='my-4' style={ { color: '#12B3ED' } } />
                    </div>

                ) : (
                    <>
                        { !detailAbsenMasuk ? (
                            <p className='text-center mt-5'>Maaf, user ini belum melakukan absen masuk</p>
                        ) : (
                            <Row className='mt-5'>
                                <Col md={ 6 }>
                                    <p>Waktu: { detailAbsenMasuk?.checkin_time.split( 'T' )[ 0 ] } { detailAbsenMasuk?.checkin_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }</p>
                                    <p>Keterlambatan: { detailAbsenMasuk?.late_duration }</p>
                                </Col>
                                <Col md={ 6 } className='text-center'>
                                    { detailAbsenMasuk?.latitude && detailAbsenMasuk?.longitude ? (
                                        <LocationMarker latitude={ detailAbsenMasuk.latitude } longitude={ detailAbsenMasuk.longitude } />
                                    ) : (
                                        <Spinner animation="border" size='lg' className='my-4' style={ { color: '#12B3ED' } } />
                                    ) }
                                </Col>
                            </Row>
                        ) }
                    </>
                ) }
            </Container>
            <Container className='mt-5'>
                <h5 className='text-center'>Absen Keluar</h5>
                { !done ? (
                    <div className='text-center'>
                        <Spinner animation="border" size='lg' className='my-4' style={ { color: '#12B3ED' } } />
                    </div>
                ) : (
                    <>
                        { !detailAbsenKeluar ? (
                            <p className='text-center mt-5'>Maaf, user ini belum melakukan absen keluar</p>
                        ) : (

                            <Row className='mt-5'>
                                <Col md={ 6 }>
                                    <p>Waktu: { detailAbsenKeluar?.checkout_time.split( 'T' )[ 0 ] } { detailAbsenKeluar?.checkout_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }</p>
                                    <p>Keluar Cepat: { detailAbsenKeluar?.early_duration }</p>
                                    <p>Lembur: { detailAbsenKeluar?.overtime_duration }</p>
                                </Col>
                                <Col md={ 6 } className='text-center'>
                                    { detailAbsenKeluar?.latitude && detailAbsenKeluar?.longitude ? (
                                        <LocationMarker latitude={ detailAbsenKeluar?.latitude } longitude={ detailAbsenKeluar?.longitude } />
                                    ) : (
                                        <Spinner animation="border" size='lg' className='my-4' style={ { color: '#12B3ED' } } />
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
