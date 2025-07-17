<template>
    <div class="app-container">
        <nav class="navbar">
            <div class="nav-content">
                <h1 class="app-title">InstaApp</h1>
                <div v-if="isAuthenticated" class="auth-info">
                    <span>Welcome, {{ user?.username }}</span>
                    <button @click="logout" class="logout-button">Logout</button>
                </div>
                <div v-else class="auth-links">
                    <!-- <RouterLink to="/login">Login</RouterLink>
                    <RouterLink to="/register">Register</RouterLink> -->
                </div>
            </div>
        </nav>
        <div class="main-content">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useAuth } from './composables/useAuth';

export default defineComponent({
    setup() {
        const { user, isAuthenticated, logout, fetchUser } = useAuth();
        console.log(user);
        onMounted(() => {
            fetchUser();
        });

        return { user, isAuthenticated, logout };
    },
});
</script>

<style scoped>
.app-container {
    min-height: 100vh;
    background: #f3f4f6;
}

.navbar {
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
}

.nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.app-title {
    font-size: 24px;
    font-weight: bold;
    color: #2563eb;
}

.auth-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.logout-button {
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
}

.logout-button:hover {
    color: #b91c1c;
}

.auth-links {
    display: flex;
    gap: 16px;
}

.auth-links a {
    color: #2563eb;
    text-decoration: none;
}

.auth-links a:hover {
    color: #1e40af;
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
}
</style>
