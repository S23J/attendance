import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { FaLocationDot } from "react-icons/fa6";
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import axios from 'axios';

const LocationMarker = ( { latitude, longitude } ) =>
{
    const [ placeName, setPlaceName ] = useState( null );
    const position = [ latitude, longitude ];
    // Convert React icon to string
    const iconString = renderToString( <FaLocationDot /> );

    const customIcon = new L.DivIcon( {
        className: 'custom-marker-icon',
        html: `<div><span>${iconString}</span></div>`,
    } );

    useEffect( () =>
    {
        const fetchPlaceName = async () =>
        {
            try {
                // const response = await axios.get(
                //     `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`

                // );
                const response = await axios.get( `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                            withCredentials: true,
                        },
                    }
                );

                const { display_name } = response.data;
                setPlaceName( display_name );
            } catch ( error ) {
                console.error( 'Error fetching place name:', error );
            }
        };

        fetchPlaceName();
    }, [ latitude, longitude ] );


    return (
        <MapContainer
            center={ position }
            zoom={ 20 }
            style={ { height: '300px', width: '100%', borderRadius: '20px' } }
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={ position } icon={ customIcon } >
                <Popup>{ placeName || 'Loading...' }</Popup>
            </Marker>
        </MapContainer>
    );
};

export default LocationMarker
