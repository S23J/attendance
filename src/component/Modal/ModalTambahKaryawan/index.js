import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import * as yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import axios from '../../../adapters/API/axios';
import { IoEyeOffSharp, IoEyeSharp } from 'react-icons/io5';
import AuthContext from '../../../auth/Context/AuthContext';
import Select from 'react-select';


const schema = yup.object().shape( {
    username: yup.string().required( 'Username di butuhkan!' ),
    email: yup.string().required( 'Email di butuhkan!' ),
    first_name: yup.string().required( 'Nama Depan di butuhkan!' ),
    last_name: yup.string().required( 'Nama Belakang di butuhkan!' ),
    no_telp: yup
        .string()
        .required( 'No. Telepon di butuhkan!' )
        .matches( /^[0-9]+$/, 'No. Telepon harus berupa angka' ),
    password: yup
        .string()
        .required( 'Password di butuhkan!' )
        .min( 8, 'Password setidaknya memiliki 8 karakter!' )
        .max( 16, 'Password tidak boleh lebih dari 16 karakter!' ),
    confirmpassword: yup.string().oneOf( [ yup.ref( 'password' ), null ], 'Passwords tidak sama!' ),
} );


function ModalTambahKaryawan ( {
    showAddKaryawan,
    setShowAddKaryawan,
    fetchListUser
} )
{

    const { tokens } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const [ listGroup, setListGroup ] = useState( [] );
    const [ passwordShown, setPasswordShown ] = useState( false );
    const [ disabled, setDisabled ] = useState( false );
    const togglePassword = () =>
    {
        setPasswordShown( !passwordShown );
    };
    const [ confirmPwdShown, setConfirmPwdShown ] = useState( false );
    const toggleConfirmPwd = () =>
    {
        setConfirmPwdShown( !confirmPwdShown );
    };
    const [ imagePerson, setImagePerson ] = useState( null );
    const handleImageChange = ( e ) =>
    {
        const selectedImage = e.target.files[ 0 ];
        if ( selectedImage.size < 5000000 ) {
            setImagePerson( selectedImage );
        } else {
            Swal.fire( {
                icon: 'error',
                title: 'Warning!',
                text: 'Gambar tidak boleh lebih dari 5Mb',
            } )
        }
    };


    useEffect( () =>
    {
        if ( tokenUser !== undefined ) fetchListGroup()
    }, [ tokenUser ] );

    const fetchListGroup = () =>
    {
        axios.get( `/api/groups/`,
            {
                headers:
                {

                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {
                let filteredArray = res.data.filter( item => item.name !== 'superuser' );
                setListGroup( filteredArray );
                // console.log( res.data )
            } ).catch( err =>
            {

                console.log( err )
            } )
    };

    const [ selectedGroup, setSelectedGroup ] = useState( null );


    const customersOptions = listGroup.map( group => ( {
        value: group.id,
        label: group.name,
    } ) );

    const handleSelectGroup = selectedOption =>
    {
        setSelectedGroup( selectedOption );
    };

    const defaultValue = {
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        no_telp: '',
        password: '',
    }


    const handleCloseAddKaryawan = () =>
    {
        setShowAddKaryawan( false );
    };


    const handleSubmitRegister = async ( values ) =>
    {
        setDisabled( true );

        const { confirmpassword, no_telp, picture, ...restData } = values;

        const finalData = Object.assign( {}, restData, {
            groups: [ selectedGroup?.value ],
        } );

        console.log( { finalData } );
        try {
            const responseUser = await axios.post( '/api/users/', finalData,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                }
            );
            console.log( responseUser )
            const combinedData = {
                phone: no_telp,
                picture: imagePerson,
                user: responseUser.data.id
            };
            try {
                const responseUEmployee = await axios.post( '/api/employee/', combinedData,
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'multipart/form-data',
                            withCredentials: true,
                            Authorization: `Token ` + tokenUser,
                        },
                    }
                );
                console.log( responseUEmployee );
            } catch ( err ) {
                console.log( err )
            }
            fetchListUser();
            handleCloseAddKaryawan();
            Swal.fire( {
                icon: 'success',
                title: 'Karyawan berhasil di Tambahkan',
                showConfirmButton: false,
                timer: 2000
            } )
            setDisabled( false );
        } catch ( err ) {
            console.log( err )
            Swal.fire( {
                icon: 'warning',
                title: 'Terjadi kesalahan saat menambahkan karyawan!',
                showConfirmButton: false,
                timer: 2000
            } )
            setDisabled( false );
        }
    }

    return (
        <Modal
            show={ showAddKaryawan }
            onHide={ handleCloseAddKaryawan }
            backdrop="static"
            keyboard={ false }
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Tambah Karyawan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={ defaultValue }
                    validationSchema={ schema }
                    onSubmit={ handleSubmitRegister }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    } ) => (
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='username'>Username*</Form.Label>
                                <Form.Control
                                    id='username'
                                    type="text"
                                    value={ values.username }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.username }
                                    required
                                    placeholder="Masukkan Username"
                                    style={ formStyles.input }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.name }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='email'>Email*</Form.Label>
                                <Form.Control
                                    id='email'
                                    type="text"
                                    value={ values.email }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.email }
                                    required
                                    placeholder="Masukkan Email"
                                    style={ formStyles.input }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.email }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='first_name'>Nama Depan*</Form.Label>
                                <Form.Control
                                    id='first_name'
                                    type="text"
                                    value={ values.first_name }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.first_name }
                                    required
                                    placeholder="Masukkan Email"
                                    style={ formStyles.input }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.first_name }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='last_name'>Nama Belakang*</Form.Label>
                                <Form.Control
                                    id='last_name'
                                    type="text"
                                    value={ values.last_name }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.last_name }
                                    required
                                    placeholder="Masukkan Email"
                                    style={ formStyles.input }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.last_name }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='no_telp'>No. Telp*</Form.Label>
                                <Form.Control
                                    id='no_telp'
                                    type="text"
                                    value={ values.no_telp }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.no_telp }
                                    required
                                    placeholder="Masukkan No. Telepon"
                                    style={ formStyles.input }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.no_telp }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='image'>Foto</Form.Label>
                                <Form.Control
                                    id='image'
                                    type="file"
                                    accept='image/png, image/jpeg'
                                    onChange={ handleImageChange }
                                    style={ { color: '#222', fontFamily: 'Poppins-Regular', } }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='group'>Divisi*</Form.Label>
                                <Select
                                    id='group'
                                    options={ customersOptions }
                                    required
                                    value={ selectedGroup }
                                    onChange={ handleSelectGroup }
                                    styles={ selectStyles }
                                />
                            </Form.Group>
                            <Form.Label className='mb-3' style={ formStyles.label } htmlFor='password'>Password*</Form.Label>
                            <Form.Group >
                                <Form.Control
                                    id='password'
                                    type={ passwordShown ? "text" : "password" }
                                    placeholder="Masukkan Password"
                                    value={ values.password }
                                    onChange={ handleChange }
                                    disabled={ disabled }
                                    isInvalid={ !!errors.password }
                                    required
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', minHeight: '50px' } }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.password }
                                </Form.Control.Feedback>
                                <p
                                    className='mt-2'
                                    onClick={ togglePassword }
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', cursor: 'pointer', maxWidth: '150px' } }
                                >
                                    { passwordShown ? "Hide " : "Show " }
                                    password
                                    <span >
                                        { passwordShown
                                            ?
                                            <IoEyeOffSharp />
                                            :
                                            <IoEyeSharp />
                                        }
                                    </span>
                                </p>
                            </Form.Group>
                            <Form.Label className='mb-3' style={ formStyles.label } htmlFor='confirmpassword'>Confirm Password*</Form.Label>
                            <Form.Group >
                                <Form.Control
                                    id='confirmpassword'
                                    type={ confirmPwdShown ? "text" : "password" }
                                    placeholder="Masukkan Konfirmasi Password"
                                    onChange={ handleChange }
                                    disabled={ disabled }
                                    isInvalid={ !!errors.confirmpassword }
                                    required
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', minHeight: '50px' } }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.confirmpassword }
                                </Form.Control.Feedback>
                                <p
                                    className='mt-2'
                                    onClick={ toggleConfirmPwd }
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', cursor: 'pointer', maxWidth: '150px' } }
                                >
                                    { confirmPwdShown ? "Hide " : "Show " }
                                    password
                                    <span >
                                        { confirmPwdShown
                                            ?
                                            <IoEyeOffSharp />
                                            :
                                            <IoEyeSharp />
                                        }
                                    </span>
                                </p>
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="btn"
                                    disabled={ disabled }
                                    type='submit'
                                    style={ { backgroundColor: '#12B3ED', color: 'white', fontFamily: 'Poppins-Regular' } }>
                                    Simpan
                                </Button>
                            </div>
                        </Form>
                    ) }
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default ModalTambahKaryawan



const formStyles = {
    label: {
        fontFamily: 'Poppins-Medium',
        color: '#222',
    },
    input: {
        color: '#222',
        fontFamily: 'Poppins-Regular',
        minHeight: '50px',
        borderColor: '#ced4da', // Initial border color
    },
};


// Custom styles for react-select
const selectStyles = {
    control: ( provided, state ) => ( {
        ...provided,
        minHeight: '50px', // Adjust the height as needed
        border: state.isFocused ? '1px solid #80bdff' : '1px solid #ced4da',
        boxShadow: state.isFocused ? '0 0 0 0.3rem rgba(0, 123, 255, 0.25)' : null,
        '&:hover': {
            borderColor: '#80bdff',
        },
        fontFamily: 'Poppins-Regular'
    } ),
    option: ( provided, state ) => ( {
        ...provided,
        color: state.isSelected ? '#fff' : '#333',
        background: state.isSelected ? '#007bff' : '#fff',
        fontFamily: 'Poppins-Regular'
    } ),
};
