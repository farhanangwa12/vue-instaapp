<template>
    <div class="space-y-4">
        <PostItem v-for="post in posts" :key="post.id" :post="post" @update-post="updatePost"
            @delete-post="removePost" />
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

        const updatePost = async (updatedPost: any) => {
          
            await fetchPosts();
           
        };

        const removePost = (postId: number) => {

            // alert("emitted deletedd");

            posts.value = posts.value.filter(post => post.id !== postId); // Hapus post dari state
        };

        return { posts, error, updatePost, removePost };
    },
});
</script>