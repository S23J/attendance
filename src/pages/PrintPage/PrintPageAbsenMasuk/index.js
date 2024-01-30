import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../../auth/Context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../adapters/API/axios';
import { Container, Spinner, Table } from 'react-bootstrap';
import instance from '../../../adapters/API/axios';

function PrintPageAbsenMasuk ()
{
    const { tokens } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const { karyawanid } = useParams();
    const [ userDetail, setUserDetail ] = useState();
    const [ detailAbsenMasuk, setDetailAbsenMasuk ] = useState();
    const [ lateDurations, setLateDurations ] = useState(
        JSON.parse( localStorage.getItem( 'lateDurations' ) ) || []
    );
    const [ done, setDone ] = useState( undefined );
    const navigate = useNavigate();

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( karyawanid !== undefined && tokenUser !== undefined ) {

                await fetchUserDetail();
                await fetchListAdetailAbsenMasuk();
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


    useEffect( () =>
    {
        if ( done ) {
            window.print();
        }
    }, [ done ] );

    useEffect( () =>
    {
        const handleAfterPrint = () =>
        {
            navigate( -1 );
        };

        window.addEventListener( 'afterprint', handleAfterPrint );

        return () =>
        {
            window.removeEventListener( 'afterprint', handleAfterPrint );
        };
    }, [ navigate ] );


    const fetchUserDetail = () =>
    {
        instance.get( `api/users/${karyawanid}`,
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

                setUserDetail( res.data );
            } ).catch( err =>
            {
                // console.log( err )
            } )
    };


    const fetchListAdetailAbsenMasuk = () =>
    {
        instance.get( `/api/checkin/?user_id=${karyawanid}`,
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
                setDetailAbsenMasuk( res.data );
                const durationsLate = res.data.map( ( item ) => item.late_duration || "00:00:00" );
                setLateDurations( durationsLate );
                setTimeout( () =>
                {
                    setDone( true );
                }, 2000 );

            } ).catch( err =>
            {
                // console.log( err )
            } )
    };


    return (
        <Container fluid style={ { minHeight: '100vh', overflowX: 'hidden' } }>
            <div className='text-start'>
                <h1 className='mt-2' style={ { fontFamily: 'Poppins-Regular' } }>Detail Absen Masuk { userDetail?.first_name } { userDetail?.last_name }</h1>
            </div>
            { !done ? (
                <Container className='text-center mb-3'>
                    <div className='my-5'>
                        <Spinner animation="border" size='lg' style={ customSpinnerStyle } />
                    </div>
                </Container>
            ) : (
                <>
                    <div className='mt-3'>
                        <Table responsive >
                            <thead style={ { fontFamily: 'Poppins-Regular' } }>
                                <tr>
                                    <th>#</th>
                                    <th>Tanggal</th>
                                    <th>Jam</th>
                                    <th>Telat</th>
                                </tr>
                            </thead>
                            <tbody style={ { fontFamily: 'Poppins-Light' } }>
                                {
                                    detailAbsenMasuk?.map( ( data, index ) =>
                                    {
                                        return (

                                            <tr key={ index }>
                                                <td>{ index + 1 }</td>
                                                <td>{ data?.checkin_time.split( 'T' )[ 0 ] }</td>
                                                <td>{ data?.checkin_time.split( 'T' )[ 1 ].split( '.' )[ 0 ] }</td>
                                                <td>{ data?.late_duration }</td>
                                            </tr>

                                        )
                                    } )
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className='my-3' style={ { fontFamily: 'Poppins-Regular' } }>
                        <h5>Total Keterlambatan : { formattedTotalLateDuration }</h5>
                    </div>
                </>
            ) }
        </Container>
    )
}

export default PrintPageAbsenMasuk


const customSpinnerStyle = {
    color: '#000A2E',
};

