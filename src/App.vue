<template>
    <div class="min-h-screen bg-gray-100">
        <nav class="bg-white shadow p-4">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-2xl font-bold text-blue-600">InstaApp</h1>
                <div v-if="isAuthenticated" class="flex items-center space-x-4">
                    <span class="text-gray-700">Welcome, {{ user?.username }}</span>
                    <button @click="logout" class="text-red-500 hover:text-red-700">Logout</button>
                </div>
                <div v-else class="space-x-4">
                    <router-link to="/login" class="text-blue-500 hover:text-blue-700">Login</router-link>
                    <router-link to="/register" class="text-blue-500 hover:text-blue-700">Register</router-link>
                </div>
            </div>
        </nav>
        <div class="container mx-auto p-4">
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useAuth } from './composables/useAuth';

export default defineComponent({
    setup() {
        const { user, isAuthenticated, logout, fetchUser } = useAuth();

        onMounted(() => {
            fetchUser();
        });

        return { user, isAuthenticated, logout };
    },
});
</script>