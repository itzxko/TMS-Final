// axiosClient.js
import axios from "axios";

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'

    },
    withCredentials: true, 
    withXSRFToken: true,
});


// Interceptor to add CSRF token to requests
axiosClient.interceptors.request.use(async config => {
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosClient;
