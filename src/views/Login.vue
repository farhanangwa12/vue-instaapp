<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input v-model="email" type="email" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" type="password" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Login</button>
                <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
            </form>
            <p class="mt-4 text-center">Don't have an account? <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link></p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '../composables/useAuth';

export default defineComponent({
    setup() {
        const email = ref('');
        const password = ref('');
        const error = ref('');
        const { login } = useAuth();

        const handleLogin = async () => {
            try {
                await login(email.value, password.value);
                error.value = '';
            } catch (err: any) {
                error.value = err.message;
            }
        };

        return { email, password, error, handleLogin };
    },
});
</script>