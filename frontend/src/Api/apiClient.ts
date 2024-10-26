import axios, { AxiosInstance } from 'axios';
import { refreshToken } from './api';

const client: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false

client.interceptors.response.use(
    response => response, 
    async error => {
        const originalRequest = error.config; 

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(client(originalRequest));
                    }, 1000);
                });
            }

            originalRequest._retry = true; 
            isRefreshing = true;

            try {
                await refreshToken(); 
                return client(originalRequest);
            } catch (err) {
                console.error("Token refresh failed, redirect to login", err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default client;
