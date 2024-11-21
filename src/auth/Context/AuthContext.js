import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext( {} );

export const AuthProvider = ( { children } ) =>
{
    const [ userInfo, setUserInfo ] = useState( null );
    const [ groups, setGroups ] = useState( null );
    const [ tokens, setTokens ] = useState( null );

    useEffect( () =>
    {
        const isLoggedIn = async () =>
        {
            try {
                let user_info = window.sessionStorage.getItem( "userInfo" );
                let user_group = window.sessionStorage.getItem( "groups" );
                let token = window.sessionStorage.getItem( "token" );

                if ( user_info ) {
                    setUserInfo( JSON.parse( user_info ) );
                }
                if ( user_group ) {
                    setGroups( JSON.parse( user_group ) );
                }
                if ( token ) {
                    setTokens( JSON.parse( token ) );
                }
            } catch ( error ) {
                console.error( "Error while fetching user data", error );
            }
        };

        isLoggedIn();
    }, [] );

    useEffect( () =>
    {
        if ( userInfo || groups || tokens ) {
            window.sessionStorage.setItem( "userInfo", JSON.stringify( userInfo ) );
            window.sessionStorage.setItem( "groups", JSON.stringify( groups ) );
            window.sessionStorage.setItem( "token", JSON.stringify( tokens ) );
        }
    }, [ userInfo, groups, tokens ] );

    return (
        <AuthContext.Provider
            value={ {
                userInfo,
                setUserInfo,
                tokens,
                setTokens,
                groups,
                setGroups,
            } }
        >
            { children }
        </AuthContext.Provider>
    );
};

export default AuthContext;
