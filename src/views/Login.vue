<template>
    <div class="login-page">
        <div class="login-box">
            <h2>Login</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Email</label>
                    <input v-model="email" type="email" required />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input v-model="password" type="password" required />
                </div>
                <button type="submit">Login</button>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
            <p class="register-link">Don't have an account? <router-link to="/register">Register</router-link></p>
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

<style scoped>
.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f3f4f6;
}

.login-box {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.login-box h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
    text-align: center;
    color: #1f2937;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: #374151;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    outline: none;
}

.form-group input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

button {
    width: 100%;
    padding: 10px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #2563eb;
}

.error {
    color: #ef4444;
    font-size: 14px;
    margin-top: 8px;
}

.register-link {
    margin-top: 16px;
    text-align: center;
}

.register-link a {
    color: #3b82f6;
    text-decoration: none;
}

.register-link a:hover {
    text-decoration: underline;
}
</style>
