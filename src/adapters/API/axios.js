// import axios from 'axios';


// export default axios.create(
//     {
//         baseURL: `https://192.168.2.91`,

//         headers: {
//             post: {
//                 'Access-Control-Allow-Origin': '*',
//                 'Content-Type': 'application/json',
//                 withCredentials: true,
//             }
//         },
//         httpsAgent: {
//             rejectUnauthorized: false,
//         }

//     } );


import axios from 'axios';

const instance = axios.create( {
    baseURL: `https://192.168.2.91`,
    headers: {
        post: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            withCredentials: true,
        }
    },
    httpsAgent: {
        rejectUnauthorized: false,
    }
} );

export default instance;