import axios from 'axios';

export default axios.create(
    {
        baseURL: `//192.168.0.41:8000`,
        headers: {
            post: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
            }
        }
        // baseURL: `https://aea8-180-245-80-61.ngrok-free.app`,
        // headers: {
        //     post: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Content-Type': 'application/json',
        //         withCredentials: true,
        //     }
        // }
    } );