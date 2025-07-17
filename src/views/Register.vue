<template>
    <div class="register-page">
        <div class="register-box">
            <h2>Register</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label>Username</label>
                    <input v-model="username" type="text" required />
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input v-model="email" type="email" required />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input v-model="password" type="password" required />
                </div>
                <button type="submit">Register</button>
                <p v-if="error" class="error">{{ error }}</p>
            </form>
            <p class="login-link">
                Already have an account? <router-link to="/login">Login</router-link>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '../composables/useAuth';

export default defineComponent({
    setup() {
        const username = ref('');
        const email = ref('');
        const password = ref('');
        const error = ref('');
        const { register } = useAuth();

        const handleRegister = async () => {
            try {
                await register(username.value, email.value, password.value);
                error.value = '';
            } catch (err: any) {
                error.value = err.message;
            }
        };

        return { username, email, password, error, handleRegister };
    },
});
</script>

<style scoped>
.register-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #f3f4f6;
}

.register-box {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.register-box h2 {
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

.login-link {
    margin-top: 16px;
    text-align: center;
}

.login-link a {
    color: #3b82f6;
    text-decoration: none;
}

.login-link a:hover {
    text-decoration: underline;
}
</style>
