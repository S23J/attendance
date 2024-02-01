import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import AuthContext from '../../../auth/Context/AuthContext';
import axios from '../../../adapters/API/axios';
import Swal from 'sweetalert2';
import instance from '../../../adapters/API/axios';

const schema = yup.object().shape( {
    phone: yup
        .string()
        .required( 'No. Telepon di butuhkan!' )
        .matches( /^[0-9]+$/, 'No. Telepon harus berupa angka' ),
    nik: yup.string().max( 16, 'NIK tidak boleh lebih dari 16 karakter!' ),
} );


function ModalEditKaryawan ( {
    showEditKaryawan,
    setShowEditKaryawan,
    fetchListUser,
    selectedEmployee
} )
{
    const { tokens } = useContext( AuthContext );
    const tokenUser = tokens?.token;
    const [ employeeDetail, setEmployeeDetail ] = useState();
    const [ disabled, setDisabled ] = useState( false );
    const [ imagePerson, setImagePerson ] = useState( null );
    const handleImageChange = ( e ) =>
    {
        const selectedImage = e.target.files[ 0 ];
        if ( selectedImage ) {
            if ( selectedImage.size < 5000000 ) {
                setImagePerson( selectedImage );
            } else {
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning!',
                    text: 'Gambar tidak boleh lebih dari 5Mb',
                } )
            }
        }

    };

    const fetchEmployeeDetail = () =>
    {
        instance.get( `api/employee_detail/${selectedEmployee?.id}`,
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
                setEmployeeDetail();
            } )
    };
    useEffect( () =>
    {
        if ( selectedEmployee?.id != null ) fetchEmployeeDetail()
    }, [ selectedEmployee?.id ] );


    const handleCloseEditKaryawan = () =>
    {
        setShowEditKaryawan( false );
        setEmployeeDetail();
        fetchEmployeeDetail();
    };

    const getTodayDate = () =>
    {
        const today = new Date();
        const year = today.getFullYear();
        const month = String( today.getMonth() + 1 ).padStart( 2, '0' );
        const day = String( today.getDate() ).padStart( 2, '0' );
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = ( e, setFieldValue ) =>
    {
        const inputDate = e.target.value;

        const currentDate = new Date();
        const selectedDate = new Date( inputDate );

        if ( selectedDate > currentDate ) {
            Swal.fire( {
                icon: 'error',
                title: 'Warning!',
                text: 'Tanggal bergabung tidak bisa lebih dari hari ini!',
            } );
            setFieldValue( 'date_joined', '' );
        } else {
            setFieldValue( 'date_joined', inputDate );
        }
    };

    const defaultValue = {
        phone: employeeDetail?.phone || '',
        nik: employeeDetail?.nik || '',
        date_joined: employeeDetail?.date_joined || '',
    }

    const handleEditKaryawan = async ( values ) =>
    {
        setDisabled( true );

        if ( !employeeDetail ) {
            const finalDataPost = {
                ...values,
                user: selectedEmployee?.id,
                picture: imagePerson,
            };
            const finalDataPost2 = {
                ...values,
                user: selectedEmployee?.id,
            }
            // console.log( finalDataPost )
            // console.log( finalDataPost2 )
            try {
                const responsePost = await instance.post( `api/employee/`,
                    imagePerson ? finalDataPost : finalDataPost2,
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'multipart/form-data',
                            withCredentials: true,
                            Authorization: `Token ` + tokenUser,
                        },
                    }
                );
                // console.log( response )
                fetchListUser();
                handleCloseEditKaryawan();
                Swal.fire( {
                    icon: 'success',
                    title: 'Karyawan berhasil di Ubah!',
                    showConfirmButton: false,
                    timer: 2000
                } )
                setDisabled( false );
            } catch ( err ) {
                console.log( err )
                Swal.fire( {
                    icon: 'warning',
                    title: 'Terjadi kesalahan saat mengubah karyawan!',
                    showConfirmButton: false,
                    timer: 2000
                } )
                setDisabled( false );
            }
        } else if ( employeeDetail ) {
            const finalDataPatch = {
                ...values,
                picture: imagePerson,
            };
            const finalDataPatch2 = {
                ...values,
            };
            // console.log( finalDataPatch )
            try {
                const responsePatch = await instance.patch( `api/employee_detail/${selectedEmployee?.id}`,
                    imagePerson ? finalDataPatch : finalDataPatch2,
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'multipart/form-data',
                            withCredentials: true,
                            Authorization: `Token ` + tokenUser,
                        },
                    }
                );
                // console.log( response )
                fetchListUser();
                handleCloseEditKaryawan();
                Swal.fire( {
                    icon: 'success',
                    title: 'Karyawan berhasil di Ubah!',
                    showConfirmButton: false,
                    timer: 2000
                } )
                setDisabled( false );
            } catch ( err ) {
                console.log( err )
                Swal.fire( {
                    icon: 'warning',
                    title: 'Terjadi kesalahan saat mengubah karyawan!',
                    showConfirmButton: false,
                    timer: 2000
                } )
                setDisabled( false );
            }
        }
    }


    return (
        <Modal
            show={ showEditKaryawan }
            onHide={ handleCloseEditKaryawan }
            backdrop="static"
            keyboard={ false }
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium' } }>
                    Ubah Karyawan { selectedEmployee?.first_name } { selectedEmployee?.last_name }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={ defaultValue }
                    enableReinitialize={ true }
                    validationSchema={ schema }
                    onSubmit={ handleEditKaryawan }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                        setFieldValue
                    } ) => (
                        <Form onSubmit={ handleSubmit }>
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
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='nik'>NIK</Form.Label>
                                <Form.Control
                                    id='nik'
                                    type="text"
                                    value={ values.nik }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.nik }
                                    required
                                    placeholder="Masukkan NIK"
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', minHeight: '50px' } }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.nik }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ { fontFamily: 'Poppins-Medium' } } htmlFor='tanggalJoin'>Tanggal Bergabung</Form.Label>
                                <Form.Control
                                    id='tanggalJoin'
                                    type='date'
                                    required
                                    max={ getTodayDate() }
                                    onChange={ ( e ) => handleDateChange( e, setFieldValue ) }
                                    value={ values.date_joined }
                                    style={ { color: '#222', fontFamily: 'Poppins-Regular', minHeight: '50px' } }
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label style={ formStyles.label } htmlFor='phone'>No. Telp*</Form.Label>
                                <Form.Control
                                    id='phone'
                                    type="text"
                                    value={ values.phone }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.phone }
                                    required
                                    placeholder="Masukkan No. Telepon"
                                    style={ formStyles.input }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.phone }
                                </Form.Control.Feedback>
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

export default ModalEditKaryawan


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


