import axios, { AxiosInstance } from 'axios';
import { refreshToken } from './api';

const client: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

client.interceptors.response.use(
    response => response, 
    async error => {
        const originalRequest = error.config; 

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            try {
                await refreshToken(); 

                return client(originalRequest);
            } catch (err) {
                console.error("Token refresh failed, redirect to login", err);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
