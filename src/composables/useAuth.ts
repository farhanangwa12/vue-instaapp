import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { User } from '../types';
const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export function useAuth() {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(!!localStorage.getItem('token'));
    const router = useRouter();


    const setUserToLocalStorage = (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const getUserFromLocalStorage = (): User | null => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${apiUrl}/api/login`, { email, password });
            localStorage.setItem('token', response.data.token);

            setUserToLocalStorage(response.data.user);
            user.value = response.data.user;
            isAuthenticated.value = true;
            await router.push('/');
        } catch (error) {
            throw new Error('Login failed: Invalid credentials');
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post(`${apiUrl}/api/register`, { username, email, password });
            localStorage.setItem('token', response.data.token);
            user.value = response.data.user;
            isAuthenticated.value = true;
            await router.push('/');
        } catch (error) {
            throw new Error('Registration failed: Invalid input');
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${apiUrl}/api/logout`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            localStorage.removeItem('token');
            user.value = null;
            isAuthenticated.value = false;
            await router.push('/login');
        } catch (error) {
            throw new Error('Logout failed');
        }
    };

    // Fetch user on app load if token exists
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get(`${apiUrl}/api/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                user.value = response.data;
                isAuthenticated.value = true;

                setUserToLocalStorage(response.data);
                return response;
            } catch (error) {
                localStorage.removeItem('token');
                isAuthenticated.value = false;

                return null;
            }
        }
    };

    return { user, isAuthenticated, login, register, logout, fetchUser };
}