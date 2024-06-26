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

// Function to fetch CSRF token
// const fetchCSRFToken = async () => {
//     try {
//         // Fetch CSRF token
//         const response = await axios.get('http://localhost:8000/sanctum/csrf-cookie');
//         return response.data.csrf_token;
//     } catch (error) {
//         console.error('Error fetching CSRF token:', error);
//         throw error; 
//     }
// };

// Interceptor to add CSRF token to requests
axiosClient.interceptors.request.use(async config => {
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosClient;
