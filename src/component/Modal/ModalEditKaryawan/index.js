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
} );


function ModalEditKaryawan ( {
    showEditKaryawan,
    setShowEditKaryawan,
    fetchListUser,
    selectedId
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
        instance.get( `api/employee_detail/${selectedId}`,
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
        if ( selectedId != null ) fetchEmployeeDetail()
    }, [ selectedId ] );

    const handleCloseEditKaryawan = () =>
    {
        setShowEditKaryawan( false );
        setEmployeeDetail();
        fetchEmployeeDetail();
    };

    const defaultValue = {
        phone: employeeDetail?.phone || '',
    }
    // console.log( selectedId )

    const handleEditKaryawan = async ( values ) =>
    {
        setDisabled( true );

        const finalData = {
            ...values,
            picture: imagePerson,
        };
        // console.log( finalData )
        try {
            const response = await instance.patch( `api/employee_detail/${selectedId}`,
                imagePerson ? finalData : values,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'multipart/form-data',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                }
            );
            console.log( response )
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
                    Ubah Karyawan
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


