import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext( {} );

export const AuthProvider = ( { children } ) =>
{
    const [ userInfo, setUserInfo ] = useState();
    const [ groups, setGroups ] = useState();
    const [ tokens, setTokens ] = useState();
    const [ showSidebar, setShowSidebar ] = useState( true );
    const toggleSidebar = () =>
    {
        setShowSidebar( !showSidebar );
    };
    const isLoggedIn = async () =>
    {
        try {

            let user_info = await window.sessionStorage.getItem( "userInfo" )
            user_info = JSON.parse( user_info )
            let user_group = await window.sessionStorage.getItem( "groups" )
            user_group = JSON.parse( user_group )

            if ( user_info ) {
                setUserInfo( user_info )
            }

            if ( user_group ) {
                setGroups( user_group )
            }


            let token = await window.sessionStorage.getItem( "token" )
            // console.log( token )
            let tokenij = JSON.parse( token )

            if ( tokenij ) {

                setTokens( tokenij )
            }

        } catch ( e ) {

        }
    }
    // console.log( tokens )
    useEffect( () =>
    {
        isLoggedIn()
    }, [] )

    // console.log( groups )

    return (
        <AuthContext.Provider value={ { userInfo, setUserInfo, tokens, setTokens, showSidebar, setShowSidebar, toggleSidebar, groups, setGroups } }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext;