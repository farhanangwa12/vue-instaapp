import { ref } from 'vue';
import axios from 'axios';
import type { Post } from '../types';

const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export function usePosts() {
    const posts = ref<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/posts`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            posts.value = response.data;
        } catch (error: any) {
            throw new Error(`Failed to fetch posts: ${error.response?.data?.message || error.message}`);
        }
    };

    const createPost = async (content: string, image: File | null) => {
        const formData = new FormData();
        formData.append('content', content);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post(`${apiUrl}/api/posts`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            posts.value.unshift(response.data); // Tambahkan post baru ke daftar
            return response.data; // Kembalikan post baru
        } catch (error: any) {
            throw new Error(`Failed to create post: ${error.response?.data?.message || error.message}`);
        }
    };

    const deletePost = async (postId: number) => {
        try {
            await axios.delete(`${apiUrl}/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            posts.value = posts.value.filter(post => post.id !== postId); // Hapus post dari state
        } catch (error: any) {
            throw new Error(`Failed to delete post: ${error.response?.data?.message || error.message}`);
        }
    };

    const toggleLike = async (postId: number) => {
        try {
            const response = await axios.post(`${apiUrl}/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const updatedPost = response.data.post; // Asumsikan API mengembalikan post yang diperbarui
            const index = posts.value.findIndex(post => post.id === postId);
            if (index !== -1) {
                posts.value[index] = updatedPost; // Perbarui post di state
            }
            return updatedPost; // Kembalikan post yang diperbarui
        } catch (error: any) {
            throw new Error(`Failed to toggle like: ${error.response?.data?.message || error.message}`);
        }
    };

    const addComment = async (postId: number, content: string) => {
        try {
            const response = await axios.post(`${apiUrl}/api/posts/${postId}/comment`, { content }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const updatedPost = response.data; // Asumsikan API mengembalikan post yang diperbarui
            // const index = posts.value.findIndex(post => post.id === postId);
            // if (index !== -1) {
            //     posts.value[index] = updatedPost; // Perbarui post di state
            // }

            console.log(updatedPost);
            return updatedPost; // Kembalikan post yang diperbarui
        } catch (error: any) {
            throw new Error(`Failed to add comment: ${error.response?.data?.message || error.message}`);
        }
    };

    const deleteComment = async (commentId: number) => {
        try {
            const response = await axios.delete(`${apiUrl}/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const updatedPost = response.data.post; // Asumsikan API mengembalikan post yang diperbarui
            const index = posts.value.findIndex(post => post.id === updatedPost.id);
            if (index !== -1) {
                posts.value[index] = updatedPost; // Perbarui post di state
            }
            return updatedPost; // Kembalikan post yang diperbarui
        } catch (error: any) {
            throw new Error(`Failed to delete comment: ${error.response?.data?.message || error.message}`);
        }
    };

    return { posts, fetchPosts, createPost, deletePost, toggleLike, addComment, deleteComment };
}