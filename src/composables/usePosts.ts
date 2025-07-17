import { ref } from 'vue';
import axios from 'axios';
import type { Post } from '../types';

export function usePosts() {
    const posts = ref<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/posts', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            posts.value = response.data;
        } catch (error) {
            throw new Error('Failed to fetch posts');
        }
    };

    const createPost = async (content: string, image: File | null) => {
        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }
        try {
            const response = await axios.post('http://localhost:8000/api/posts', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            posts.value.unshift(response.data);
        } catch (error) {
            throw new Error('Failed to create post');
        }
    };

    const deletePost = async (postId: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            posts.value = posts.value.filter(post => post.id !== postId);
        } catch (error) {
            throw new Error('Failed to delete post');
        }
    };

    const toggleLike = async (postId: number) => {
        try {
            await axios.post(`http://localhost:8000/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            await fetchPosts(); // Refresh posts to update like count
        } catch (error) {
            throw new Error('Like action failed');
        }
    };

    const addComment = async (postId: number, content: string) => {
        try {
            await axios.post(`http://localhost:8000/api/posts/${postId}/comment`, { content }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            await fetchPosts(); // Refresh posts to update comments
        } catch (error) {
            throw new Error('Failed to add comment');
        }
    };

    const deleteComment = async (commentId: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            await fetchPosts(); // Refresh posts to update comments
        } catch (error) {
            throw new Error('Failed to delete comment');
        }
    };

    return { posts, fetchPosts, createPost, deletePost, toggleLike, addComment, deleteComment };
}