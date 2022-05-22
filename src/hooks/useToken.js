import { useState } from 'react';

require('dotenv').config();

const useToken = () => {
    const getToken = () =>{
        const token = sessionStorage.getItem('token');
        console.log({ token });
        return token
    }

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', userToken ? userToken : null);
        setToken(useToken.token);
    }

    const isValidToken = () => !!(token && (token === process.env.REACT_APP_AUTHORIZED_USER || token === process.env.REACT_APP_AUTHORIZED_USER2))

    return {
        setToken: saveToken,
        token,
        isValidToken
    }
}

export default useToken;