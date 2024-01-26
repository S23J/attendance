import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap'
import { ImageDevices, LogoBundar } from '../../assets/images/image'
import Swal from 'sweetalert2';
import AuthContext from '../../auth/Context/AuthContext';
import axios from '../../adapters/API/axios';
import { useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';

function Login ()
{

    const [ username, setUser ] = useState( '' );
    const [ password, setPwd ] = useState( '' );
    const { setTokens, setUserInfo, setGroups } = useContext( AuthContext );
    const [ disabled, setDisabled ] = useState( false );
    const [ isSubmittingLogin, setIsSubmittingLogin ] = useState( false );
    const navigate = useNavigate();
    const [ passwordShown, setPasswordShown ] = useState( false );
    const togglePassword = () =>
    {
        setPasswordShown( !passwordShown );
    };


    const win = window.sessionStorage
    const handleSubmitLogin = async ( event ) =>
    {
        event.preventDefault()
        setIsSubmittingLogin( true );
        setDisabled( true )
        const data = {
            username: username,
            password: password,
        }
        try {
            const response = await axios.post( `/api/login/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    },
                }
            );

            const userInfo = response?.data.user
            const userToken = response?.data
            const userGroups = response?.data.groups
            setTokens( { token: userToken.token } );
            win.setItem( "token", JSON.stringify( { token: userToken.token } ) )
            setUserInfo( userInfo );
            win.setItem( "userInfo", JSON.stringify( userInfo ) )
            setGroups( userGroups );
            win.setItem( "groups", JSON.stringify( userGroups ) )
            Swal.fire( {
                icon: 'success',
                title: 'Login berhasil',
                showConfirmButton: false,
                timer: 2000
            } )
            setIsSubmittingLogin( false );
            setDisabled( false );

            if ( userGroups.includes( 'hrd' ) || userGroups.includes( 'super_user' ) ) {
                navigate( '/hrd/' )
            } else {
                navigate( '/home/' )
            }
            // console.log( response.data )

        } catch ( err ) {
            // console.log( err )
            if ( !err?.response ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: 'Server tidak ada respon',
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
            } else if ( err.response?.status === 400 ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: `${err.response?.data.non_field_errors}`,
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
            } else if ( err.response?.status === 401 ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: `Periksa kembali Username dan Password anda`,
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
            }
        }
    };

    return (
        <Container
            fluid
            className='vh-100 d-flex align-items-center justify-content-center'
        >
            <div
                id='cardLogin'
                className='text-center my-5'
            >
                <Row>
                    <Col xs={ 12 } md={ 6 } lg={ 6 } className='text-center'>
                        <div className='text-start'>
                            <Image
                                src={ LogoBundar }
                                fluid
                                width={ 100 }
                            />
                        </div>
                        <h4 className='my-4 mx-4' style={ { fontFamily: 'Poppins-Medium' } }>Selamat datang di Aplikasi Absensi kami!</h4>
                        <div className='mb-5 text-center mx-4'>
                            <Image
                                src={ ImageDevices }
                                fluid
                                width={ 500 }

                            />
                        </div>
                    </Col>
                    <Col xs={ 12 } md={ 6 } lg={ 6 } className='text-start my-auto' >
                        <div className='mx-4'>
                            <p className='text-center mb-5' style={ { fontFamily: 'Poppins-Light' } }>Silahkan Login menggunakan Akun yang sudah dibuat!</p>
                            <Form onSubmit={ handleSubmitLogin } >
                                <Form.Group className="mb-3">
                                    <Form.Label style={ formStyles.label } htmlFor='usernameLogin'>Username*</Form.Label>
                                    <Form.Control
                                        id='username'
                                        type="text"
                                        disabled={ disabled }
                                        onChange={ ( e ) => setUser( e.target.value ) }
                                        value={ username }
                                        required
                                        placeholder="Masukkan username anda"
                                        style={ formStyles.input }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label style={ formStyles.label } htmlFor='passwordLogin'>Password*</Form.Label>
                                    <Form.Control
                                        id='password'
                                        type={ passwordShown ? "text" : "password" }
                                        disabled={ disabled }
                                        onChange={ ( e ) => setPwd( e.target.value ) }
                                        value={ password }
                                        required
                                        placeholder="Masukkan password anda"
                                        style={ formStyles.input }
                                    />
                                    <p className='mt-2' onClick={ togglePassword } style={ { fontFamily: 'Poppins-Regular', cursor: 'pointer', maxWidth: '150px' } }>{ passwordShown ? "Hide" : "Show" } password <span >{ passwordShown ? <AiFillEyeInvisible /> : <AiFillEye /> } </span></p>
                                </Form.Group>
                                <div className="d-grid gap-2 my-4">
                                    { isSubmittingLogin ? (
                                        <Button
                                            type="submit"
                                            id='actionButtonLogin'
                                            variant='btn'
                                            disabled={ disabled }
                                        >
                                            <Spinner animation="border" size='sm' style={ { color: '#12B3ED' } } />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            id='actionButtonLogin'
                                            variant='primary'
                                            disabled={ disabled }
                                        >
                                            Masuk
                                        </Button>
                                    ) }
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default Login



const formStyles = {
    label: {
        fontFamily: 'Poppins-Medium',
        color: 'white',
    },
    input: {
        color: '#222',
        fontFamily: 'Poppins-Regular',
        minHeight: '50px',
        borderColor: '#ced4da', // Initial border color
    },
};
