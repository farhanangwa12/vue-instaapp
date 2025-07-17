<template>
    <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-3">
            <span class="font-bold text-gray-800">{{ post.user.username }}</span>
            <span class="text-gray-500 text-sm ml-2">{{ new Date(post.created_at).toLocaleString() }}</span>
        </div>
        <p class="mb-3 text-gray-700">{{ post.content }}</p>
        <img v-if="post.image" :src="'http://localhost:8000/storage/' + post.image" class="w-full rounded-md mb-3" alt="Post image" />
        <div class="flex items-center mb-3">
            <button @click="handleToggleLike" class="text-blue-500 hover:text-blue-700 mr-4">
                {{ post.likes.some(like => like.user_id === user?.id) ? 'Unlike' : 'Like' }} ({{ post.likes.length }})
            </button>
        </div>
        <div class="border-t pt-3">
            <div v-for="comment in post.comments" :key="comment.id" class="flex justify-between mb-2">
                <span><strong>{{ comment.user.username }}</strong>: {{ comment.content }}</span>
                <button v-if="comment.user_id === user?.id" @click="handleDeleteComment(comment.id)" class="text-red-500 hover:text-red-700">Delete</button>
            </div>
            <form @submit.prevent="handleAddComment" class="mt-3">
                <input v-model="newComment" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a comment..." required />
                <button type="submit" class="bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600">Comment</button>
            </form>
        </div>
        <button v-if="post.user_id === user?.id" @click="handleDeletePost" class="text-red-500 hover:text-red-700 mt-3">Delete Post</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { usePosts } from '../composables/usePosts';
import type { Post } from '../types';

export default defineComponent({
    props: {
        post: {
            type: Object as () => Post,
            required: true,
        },
    },
    setup(props) {
        const { user } = useAuth();
        const { toggleLike, addComment, deleteComment, deletePost } = usePosts();
        const newComment = ref('');

        const handleToggleLike = async () => {
            try {
                await toggleLike(props.post.id);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        const handleAddComment = async () => {
            try {
                await addComment(props.post.id, newComment.value);
                newComment.value = '';
            } catch (error: any) {
                console.error(error.message);
            }
        };

        const handleDeleteComment = async (commentId: number) => {
            try {
                await deleteComment(commentId);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        const handleDeletePost = async () => {
            try {
                await deletePost(props.post.id);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        return { user, newComment, handleToggleLike, handleAddComment, handleDeleteComment, handleDeletePost };
    },
});
</script>