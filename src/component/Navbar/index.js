import React, { useContext } from 'react'
import { Container, Image, Nav, Navbar, Offcanvas } from 'react-bootstrap'
import { LogoNama } from '../../assets/images/image'
import AuthContext from '../../auth/Context/AuthContext';
import { NavLink } from 'react-router-dom';

function NavbarComponent ()
{
    const { groups } = useContext( AuthContext );

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
                    style={ { maxWidth: '200px' } }
                >
                    <Offcanvas.Header closeButton style={ { fontFamily: 'Poppins-Medium' } }>
                        <Offcanvas.Title id={ `offcanvasNavbarLabel-expand-${false}` }>
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body style={ { fontFamily: 'Poppins-Regular' } }>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            { groups?.includes( 'hrd' ) || groups?.includes( 'super_user' ) ?
                                (
                                    <>
                                        <NavLink
                                            to='/hrd/'
                                            className='my-2'
                                            style={ { textDecoration: 'none', color: '#222' } }
                                        >
                                            Home
                                        </NavLink>
                                        <NavLink
                                            to='/data-karyawan/'
                                            className='my-2'
                                            style={ { textDecoration: 'none', color: '#222' } }
                                        >
                                            Data Karyawan
                                        </NavLink>
                                        <Nav.Link href="#action2">Keluar</Nav.Link>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <NavLink
                                            to='/home/'
                                            className='my-2'
                                            style={ { textDecoration: 'none', color: '#222' } }
                                        >
                                            Home
                                        </NavLink>
                                        <NavLink
                                            to='/data-absensi/'
                                            className='my-2'
                                            style={ { textDecoration: 'none', color: '#222' } }
                                        >
                                            Data Absensi
                                        </NavLink>
                                        <Nav.Link href="#action2">Keluar</Nav.Link>
                                    </>
                                )
                            }

                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}

export default NavbarComponent
