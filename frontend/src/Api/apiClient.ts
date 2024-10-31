import axios, { AxiosInstance } from 'axios';
import { refreshToken } from './api';

const client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false;
let retryCount = 0;
const maxRetry = 3;

client.interceptors.response.use(
    response => response, 
    async error => {
        const originalRequest = error.config; 

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
            retryCount++;

            try {
                await refreshToken(); 
                retryCount = 0;
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
