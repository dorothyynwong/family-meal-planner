import axios, { AxiosInstance } from 'axios';

const client: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default client;
