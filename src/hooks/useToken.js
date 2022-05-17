import { useState } from 'react';

require('dotenv').config();

const useToken = () => {
    const getToken = () => sessionStorage.getItem('token');

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', userToken ? userToken : null);
        setToken(useToken.token);
    }

    const isValidToken = async () => !!(token && token === process.env.REACT_APP_AUTHORIZED_USER)

    return {
        setToken: saveToken,
        token,
        isValidToken
    }
}

export default useToken;