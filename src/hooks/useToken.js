import { useState } from 'react';

const useToken = () => {
    const getToken = () => sessionStorage.getItem('token');

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', userToken ? JSON.stringify(userToken) : null);
        setToken(useToken.token);
    }

    return {
        setToken: saveToken,
        token
    }
}

export default useToken;