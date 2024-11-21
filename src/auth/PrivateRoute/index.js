import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../Context/AuthContext'

function PrivateRoutes ( props )
{
    if ( sessionStorage.getItem( "userInfo" ) ) {
        return <>{ props.children }</>;
    } else {
        return <Navigate to="/" />;

    }
}

export default PrivateRoutes