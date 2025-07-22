import axios from 'axios';
const axiosInstance = axios.create({
    //  baseURL: 'http://api.urizionapp.com/',
     baseURL: 'https://api.urizonapp.com/',
    // baseURL: 'http://192.168.18.80:7666/',
    // baseURL: 'http://192.168.1.17:7666/',
    // baseURL: 'https://dedevelopers.org/',
    timeout: 5000,
});
export default axiosInstance;
