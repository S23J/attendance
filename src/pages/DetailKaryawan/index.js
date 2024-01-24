import React, { useContext, useEffect, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Image, Row, Table } from 'react-bootstrap';
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import { useMediaQuery } from 'react-responsive';
import { GoInfo } from 'react-icons/go';

function DetailKaryawan ()
{
    const { karyawanid } = useParams();
    const { tokens } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const [ userDetail, setUserDetail ] = useState();
    const [ employeeDetail, setEmployeeDetail ] = useState();
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const [ absensiMasuk, setAbsensiMasuk ] = useState( [] );
    const [ absensiKeluar, setAbsensiKeluar ] = useState( [] );
    const [ lateDurations, setLateDurations ] = useState(
        JSON.parse( localStorage.getItem( 'lateDurations' ) ) || []
    );
    const [ earlyOutDurations, setEarlyOutDurations ] = useState(
        JSON.parse( localStorage.getItem( 'earlyOutDurations' ) ) || []
    );
    const [ overtimeDurations, setOvertimeDurations ] = useState(
        JSON.parse( localStorage.getItem( 'overtimeDurations' ) ) || []
    );

    const navigate = useNavigate();

    const handleAbsensiDetail = ( data ) =>
    {
        navigate( '/detail-absensi/' + data.id + '/' )
    }

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( karyawanid !== undefined && tokenUser !== undefined ) {

                await fetchUserDetail();
                await fetchEmployeeDetail();
                await fetchListAbsensiMasuk();
                await fetchListAbsensiKeluar();

            }
        };

        fetchData();
    }, [ karyawanid, tokenUser ] );

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


    const fetchUserDetail = () =>
    {
        axios.get( `api/users/${karyawanid}`,
            {
                headers:
                {

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                setUserDetail( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };

    const fetchEmployeeDetail = () =>
    {
        axios.get( `api/employee/${karyawanid}`,
            {
                headers:
                {

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                setEmployeeDetail( res.data );

                // console.log( res.data )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };


    const fetchListAbsensiMasuk = () =>
    {
        axios.get( `/api/checkin/?user_id=${karyawanid}`,
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

            } ).catch( err =>
            {

                console.log( err )
            } )
    };

    const fetchListAbsensiKeluar = () =>
    {
        axios.get( `/api/checkout/?user_id=${karyawanid}`,
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

    // console.log( absensiMasuk )


    return (
        <>
            <NavbarComponent />
            <h1 className='display-6 text-center'>Info Detail</h1>
            <h3 className='text-center'>Nama: { userDetail?.first_name } { userDetail?.last_name }</h3>
            <Container className='mt-5' style={ { maxWidth: '800px' } }>
                <Row>
                    <Col md={ 6 } className='text-center' style={ { fontFamily: 'Poppins-Regular' } }>
                        <Image
                            src={ employeeDetail?.picture }
                            fluid
                            width={ 300 }
                            rounded
                            // roundedCircle
                            style={ { border: '10px solid #000A2E' } }
                        />
                    </Col>
                    <Col md={ 6 } className={ isMobile ? 'my-auto text-center mt-5' : 'my-auto' } style={ { fontFamily: 'Poppins-Regular' } }>
                        <p >Username: { userDetail?.username }</p>
                        <p >Email: { userDetail?.email }</p>
                        <p >No. Telp: { employeeDetail?.phone }</p>
                    </Col>
                </Row>
            </Container>
            <Container className='mt-5'>
                <Row>
                    <Col md={ 5 } className='mb-3'>
                        <Table responsive>
                            <thead>
                                <tr className='text-center'>
                                    <th>#</th>
                                    <th>Detail</th>
                                    <th>Masuk</th>
                                    <th>Keterlambatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    absensiMasuk?.map( ( data, index ) =>
                                    {
                                        return (
                                            <tr key={ index } className='text-center'>
                                                <td>{ index + 1 }</td>
                                                <td >
                                                    <GoInfo
                                                        size={ 25 }
                                                        onClick={ () => handleAbsensiDetail( data ) }
                                                        style={ { cursor: 'pointer' } } />
                                                </td>
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
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Keluar</th>
                                    <th>Keluar Cepat</th>
                                    <th>Lembur</th>
                                </tr>
                            </thead>
                            <tbody>
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

export default DetailKaryawan
