// import { Project, Task } from '@/store/useStore';
import axios, { AxiosInstance } from 'axios';


const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Change this to your backend URL
    timeout: 10000, // Timeout after 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors to handle tokens, etc.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Replace with your token handling method
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


//auth routes
export const signup = async (email: string, password: string, name: string, role: string) => {
    return api.post('/auth/signup', { email, password, name, role });
};

export const verifyEmail = async (code: string) => {
    return api.post('/auth/verify-email', { code });
}
export const login = async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
};

export const logout = async () => {
    return api.post('/auth/logout');
};

export const forgotPassword = async (email: string) => {
    return api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, password: string) => {
    return api.post(`/auth/reset-password/${token}`, { password });
};

export const checkAuth = async () => {
    return api.get('/auth/check-auth');
}

export default api;
