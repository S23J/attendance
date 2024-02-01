import React, { useContext } from 'react'
import { Container, Image, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { LogoNama } from '../../assets/images/image'
import AuthContext from '../../auth/Context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../adapters/API/axios';
import instance from '../../adapters/API/axios';

function NavbarComponent ()
{
    const { groups, setGroups, tokens, setTokens, setUserInfo } = useContext( AuthContext );
    const navigate = useNavigate();

    const LogoutSession = async () =>
    {
        const confirmDelete = await Swal.fire( {
            title: 'Apakah anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Keluar',
            cancelButtonText: 'Batal',
        } );

        if ( !confirmDelete.isConfirmed ) {

            return;
        }
        try {
            await instance.post(
                '/api/logout/',
                {},
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ${tokens.token}`,
                    },
                }
            );

            sessionStorage.removeItem( 'userInfo' );
            sessionStorage.removeItem( 'token' );
            sessionStorage.removeItem( 'groups' );
            setTokens();
            setUserInfo();
            setGroups();
            Swal.fire( {
                icon: 'success',
                title: 'Logout Berhasil',
                showConfirmButton: false,
                timer: 2000,
            } );
            navigate( '/' );
        } catch ( error ) {
            // console.log( error );
            Swal.fire( {
                icon: 'error',
                title: 'Warning!',
                text: 'Logout gagal!',
            } );
        }
    };



    return (
        <Navbar expand={ false } className="mb-3" sticky="top" style={ { backgroundColor: '#000A2E', minHeight: '70px' } }>
            <Container fluid>
                <Navbar.Brand href="#">
                    <Image
                        src={ LogoNama }
                        fluid
                        width={ 200 }
                    />
                </Navbar.Brand>
                <Navbar.Toggle style={ { backgroundColor: 'white' } } />
                <Navbar.Offcanvas
                    id={ `offcanvasNavbar-expand-${false}` }
                    aria-labelledby={ `offcanvasNavbarLabel-expand-${false}` }
                    placement="end"
                    data-bs-theme="dark"
                    className='bg-dark'
                    style={ { maxWidth: '200px', backgroundColor: '#1E1E1E', color: 'white' } }
                >
                    <Offcanvas.Header closeButton style={ { fontFamily: 'Poppins-Medium' } }>
                        <Offcanvas.Title id={ `offcanvasNavbarLabel-expand-${false}` }>
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body style={ { fontFamily: 'Poppins-Regular' } }>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <NavLink
                                to='/home/'
                                className='my-2'
                                style={ { textDecoration: 'none', color: 'white' } }
                            >
                                Home
                            </NavLink>
                            { groups?.includes( 'HRD & GA' ) || groups?.includes( 'superuser' ) ?
                                (
                                    <>
                                        <NavLink
                                            to='/data-karyawan/'
                                            className='my-2'
                                            style={ { textDecoration: 'none', color: 'white' } }
                                        >
                                            Data Karyawan
                                        </NavLink>

                                    </>
                                )
                                :
                                (
                                    <>

                                        <NavLink
                                            to='/data-absensi/'
                                            className='my-2'
                                            style={ { textDecoration: 'none', color: 'white' } }
                                        >
                                            Data Absensi
                                        </NavLink>
                                    </>
                                )
                            }
                            <NavLink className='my-2' onClick={ LogoutSession } style={ { textDecoration: 'none', color: 'white' } }>Keluar</NavLink>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}

export default NavbarComponent
