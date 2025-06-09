import Cookies from 'js-cookie';

const config = {
    getAuthToken: () => Cookies.get('authToken') || null // Fetch token from cookies
};

export default config;