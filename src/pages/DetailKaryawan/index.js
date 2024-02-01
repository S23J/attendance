import React, { useContext, useEffect, useState } from 'react'
import NavbarComponent from '../../component/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Container, Image, Row, Tab, Tabs } from 'react-bootstrap';
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import { useMediaQuery } from 'react-responsive';
import TabAbsenMasuk from '../../component/TabsAbsensi/TabAbsenMasuk';
import TabAbsenKeluar from '../../component/TabsAbsensi/TabAbsenKeluar';
import instance from '../../adapters/API/axios';

function DetailKaryawan ()
{
    const { karyawanid } = useParams();
    const { tokens } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const [ userDetail, setUserDetail ] = useState();
    const [ employeeDetail, setEmployeeDetail ] = useState();
    const [ listGroup, setListGroup ] = useState( [] );
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

    const handleAbsensiDetail = ( row ) =>
    {
        navigate( '/detail-absensi/' + row.id + '/' )
    }
    const handleBack = () =>
    {
        navigate( -1 )
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
                fetchListGroup( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {

                // console.log( err )
            } )
    };

    const fetchEmployeeDetail = () =>
    {
        instance.get( `api/employee_detail/${karyawanid}`,
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

                setEmployeeDetail( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {

                // console.log( err )
            } )
    };


    const fetchListGroup = ( user_detail ) =>
    {
        instance.get( `/api/groups/`,
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
                const userGroupId = user_detail?.groups[ 0 ];

                const filteredGroup = res.data.filter( group => group?.id === userGroupId );

                setListGroup( filteredGroup[ 0 ] );

                // console.log( res.data )
            } ).catch( err =>
            {

                // console.log( err )
            } )
    };

    const fetchListAbsensiMasuk = () =>
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

                setAbsensiMasuk( res.data );
                const durationsLate = res.data.map( ( item ) => item.late_duration || "00:00:00" );
                setLateDurations( durationsLate );
                // console.log( res.data )
            } ).catch( err =>
            {

                // console.log( err )
            } )
    };

    const fetchListAbsensiKeluar = () =>
    {
        instance.get( `/api/checkout/?user_id=${karyawanid}`,
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

                setAbsensiKeluar( res.data );
                const durationsEarly = res.data.map( ( item ) => item.early_duration || "00:00:00" );
                setEarlyOutDurations( durationsEarly );
                const durationsOver = res.data.map( ( item ) => item.overtime_duration || "00:00:00" );
                setOvertimeDurations( durationsOver );
                // console.log( res.data )
            } ).catch( err =>
            {

                // console.log( err )
            } )
    };


    const formatDate = ( dateString ) =>
    {
        const date = new Date( dateString );

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;

        const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

        return formattedDate;
    };


    return (
        <>
            <NavbarComponent />
            <Container className='mt-4'>
                <Row>
                    <Col xs={ 6 } md={ 11 } className='my-auto'>
                        <h1 className='display-6 text-start' style={ { fontFamily: 'Poppins-Light' } } >Info Detail</h1>

                    </Col>
                    <Col xs={ 6 } md={ 1 } className='text-end'>
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
            <h3 className='text-center mt-3' style={ { fontFamily: 'Poppins-Regular' } }>Nama: { userDetail?.first_name } { userDetail?.last_name }</h3>
            <Container className='mt-5' style={ { maxWidth: '800px' } }>
                <Row>
                    <Col md={ 6 } className='text-center' >
                        <Image
                            src={ employeeDetail?.picture }
                            fluid
                            width={ 300 }
                            rounded
                            style={ { border: '10px solid #000A2E' } }
                        />
                    </Col>
                    <Col md={ 6 } className={ isMobile ? 'my-auto text-center mt-5' : 'my-auto' } style={ { fontFamily: 'Poppins-Regular' } }>
                        <p >Username: { userDetail?.username }</p>
                        <p >NIK: { employeeDetail?.nik }</p>
                        <p>Tanggal Bergabung: { employeeDetail ? formatDate( employeeDetail.date_joined ) : '' }</p>
                        <p >No. Telp: { employeeDetail?.phone }</p>
                        <p >Divisi : { listGroup?.name }</p>
                    </Col>
                </Row>
            </Container>
            <Container className='mt-5'>
                <Tabs
                    defaultActiveKey="masuk"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
                >
                    <Tab eventKey="masuk" title="Absensi Masuk">
                        <TabAbsenMasuk
                            karyawanid={ karyawanid }
                            userDetail={ userDetail }
                            absensiMasuk={ absensiMasuk }
                            handleAbsensiDetail={ handleAbsensiDetail }
                            formattedTotalLateDuration={ formattedTotalLateDuration }
                        />
                    </Tab>
                    <Tab eventKey="pulang" title="Absensi Pulang">
                        <TabAbsenKeluar
                            karyawanid={ karyawanid }
                            userDetail={ userDetail }
                            absensiKeluar={ absensiKeluar }
                            formattedTotalEarlyDuration={ formattedTotalEarlyDuration }
                            formattedTotalOverDuration={ formattedTotalOverDuration }
                        />
                    </Tab>
                </Tabs>
                <div className='my-3' style={ { fontFamily: 'Poppins-Regular' } }>
                    <h5>Total Keterlambatan : { formattedTotalLateDuration }</h5>
                    <h5>Total Pulang Awal : { formattedTotalEarlyDuration }</h5>
                    <h5>Total Lembur : { formattedTotalOverDuration }</h5>
                </div> 
            </Container>
        </>
    )
}

export default DetailKaryawan
