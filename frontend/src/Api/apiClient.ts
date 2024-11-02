import axios, { AxiosInstance } from 'axios';
import { refreshToken } from './api';

const client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false;
let retryCount = 0;
const maxRetry = 5;

client.interceptors.response.use(
    response => response, 
    async error => {
        const originalRequest = error.config; 

        retryCount++;

        if (error.response?.status === 401 && !originalRequest._retry && retryCount < maxRetry) {
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
                window.location.href = '/login';  
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
                retryCount = 0;
            }
        }

        return Promise.reject(error);
    }
);

export default client;
