import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../Context/AuthContext'

function PrivateRoutes ()
{
    const { tokens } = useContext( AuthContext )
    const userToken = tokens?.token
    let token = window.sessionStorage.getItem( "token" );

    return userToken || token ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRoutes