import React, { useContext, useEffect, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import axios from '../../adapters/API/axios';
import AuthContext from '../../auth/Context/AuthContext';
import { GoInfo } from "react-icons/go";

function AbsensiPage ()
{
    const [ absensiMasuk, setAbsensiMasuk ] = useState( [] );
    const [ absensiKeluar, setAbsensiKeluar ] = useState( [] );
    const { tokens, userInfo } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const [ lateDurations, setLateDurations ] = useState(
        JSON.parse( localStorage.getItem( 'lateDurations' ) ) || []
    );
    const [ earlyOutDurations, setEarlyOutDurations ] = useState(
        JSON.parse( localStorage.getItem( 'earlyOutDurations' ) ) || []
    );
    const [ overtimeDurations, setOvertimeDurations ] = useState(
        JSON.parse( localStorage.getItem( 'overtimeDurations' ) ) || []
    );

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( userInfo?.id !== undefined && tokenUser !== undefined ) {

                await fetchListAbsensiMasuk();
                await fetchListAbsensiKeluar();

            }
        };

        fetchData();
    }, [ userInfo?.id, tokenUser ] );

    const calculateTotalDuration = ( durations ) =>
    {
        return durations.reduce( ( acc, duration ) =>
        {
            const [ hours, minutes, seconds ] = duration.split( ':' );
            return acc + parseInt( hours ) * 3600 + parseInt( minutes ) * 60 + parseInt( seconds );
        }, 0 );
    };

    const formatDuration = ( totalSeconds ) =>
    {
        const hours = Math.floor( totalSeconds / 3600 );
        const minutes = Math.floor( ( totalSeconds % 3600 ) / 60 );
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart( 2, '0' )}:${minutes.toString().padStart( 2, '0' )}:${seconds.toString().padStart( 2, '0' )}`;
    };

    const formattedTotalLateDuration = formatDuration( calculateTotalDuration( lateDurations ) );
    const formattedTotalEarlyDuration = formatDuration( earlyOutDurations.length > 0 ? calculateTotalDuration( earlyOutDurations ) : 0 );
    const formattedTotalOverDuration = formatDuration( overtimeDurations.length > 0 ? calculateTotalDuration( overtimeDurations ) : 0 );

    const fetchListAbsensiMasuk = () =>
    {
        axios.get( `/api/checkin/?user_id=${userInfo?.id}`,
            {
                headers:
                {

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                setAbsensiMasuk( res.data );
                const durationsLate = res.data.map( ( item ) => item.late_duration || "00:00:00" );
                setLateDurations( durationsLate );
                // console.log( res.data )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };

    const fetchListAbsensiKeluar = () =>
    {
        axios.get( `/api/checkout/?user_id=${userInfo?.id}`,
            {
                headers:
                {

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                setAbsensiKeluar( res.data );
                const durationsEarly = res.data.map( ( item ) => item.early_duration || "00:00:00" );
                setEarlyOutDurations( durationsEarly );
                const durationsOver = res.data.map( ( item ) => item.overtime_duration || "00:00:00" );
                setOvertimeDurations( durationsOver );
                // console.log( res.data )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };



    return (
        <>
            <NavbarComponent />
            <h1 className='display-6 text-center' style={ { fontFamily: 'Poppins-Light' } }>Data Absensi</h1>
            <Container className='mt-5'>
                <Row>
                    <Col md={ 5 } className='mb-3'>
                        <Table responsive>
                            <thead style={ { fontFamily: 'Poppins-Regular' } }>
                                <tr className='text-center'>
                                    <th>#</th>
                                    <th>Masuk</th>
                                    <th>Keterlambatan</th>
                                </tr>
                            </thead>
                            <tbody style={ { fontFamily: 'Poppins-Light' } }>
                                {
                                    absensiMasuk?.map( ( data, index ) =>
                                    {
                                        return (
                                            <tr key={ index } className='text-center'>
                                                <td>{ index + 1 }</td>
                                                <td>
                                                    { data?.checkin_time.split( 'T' )[ 0 ] } { data?.checkin_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }
                                                </td>
                                                <td>{ data?.late_duration }</td>
                                            </tr>
                                        )
                                    } )
                                }
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={ 7 } className='mb-3'>
                        <Table responsive>
                            <thead style={ { fontFamily: 'Poppins-Regular' } }>
                                <tr>
                                    <th>#</th>
                                    <th>Keluar</th>
                                    <th>Keluar Cepat</th>
                                    <th>Lembur</th>
                                </tr>
                            </thead>
                            <tbody style={ { fontFamily: 'Poppins-Light' } }>
                                {
                                    absensiKeluar?.map( ( data, index ) =>
                                    {
                                        return (
                                            <tr key={ index }>
                                                <td>{ index + 1 }</td>
                                                <td>
                                                    { data?.checkout_time.split( 'T' )[ 0 ] } { data?.checkout_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }
                                                </td>
                                                <td>{ data?.early_duration }</td>
                                                <td>{ data?.overtime_duration }</td>
                                            </tr>
                                        )
                                    } )
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <div className='my-3' style={ { fontFamily: 'Poppins-Regular' } }>
                    <h5>Total Keterlambatan : { formattedTotalLateDuration }</h5>
                    <h5>Total Keluar Cepat : { formattedTotalEarlyDuration }</h5>
                    <h5>Total Lembur : { formattedTotalOverDuration }</h5>
                </div>
            </Container>
        </>
    )
}

export default AbsensiPage
