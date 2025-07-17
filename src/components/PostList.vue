<template>
    <div class="space-y-4">
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { usePosts } from '../composables/usePosts';
import PostItem from './PostItem.vue';
import type { Post } from '../types';

export default defineComponent({
    components: { PostItem },
    setup() {
        const { posts, fetchPosts } = usePosts();
        const error = ref('');

        onMounted(async () => {
            try {
                await fetchPosts();
            } catch (err: any) {
                error.value = err.message;
            }
        });

        return { posts, error };
    },
});
</script>