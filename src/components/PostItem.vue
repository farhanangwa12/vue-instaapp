<template>
    <div class="post-card">
        <div class="post-header">
            <div class="user-info">
                <div class="avatar">
                    <span>{{ post.user.name[0] }}</span>
                </div>
                <div class="user-details">
                    <span class="username">{{ post.user.name }}</span>
                    <span class="timestamp">{{ new Date(post.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) }}</span>
                </div>
            </div>
            <button v-if="post.user_id === user?.id" @click="handleDeletePost" class="delete-post-button">Delete</button>
        </div>
        <p class="post-content">{{ post.content }}</p>
        <img v-if="post.image" :src="'http://localhost:8000/storage/' + post.image" alt="Post image" class="post-image" />
        <div class="post-actions">
            <button @click="handleToggleLike" class="like-button">
                <svg :class="{ 'liked': post.likes.some(like => like.user_id === user?.id) }" class="like-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span>{{ post.likes.length }} {{ post.likes.length === 1 ? 'Like' : 'Likes' }}</span>
            </button>
        </div>
        <div class="comments-section">
            <div v-for="comment in post.comments" :key="comment.id" class="comment">
                <div class="comment-content">
                    <div class="comment-avatar">
                        <span>{{ comment.user.name[0] }}</span>
                    </div>
                    <div>
                        <span class="comment-username">{{ comment.user.name }}</span>
                        <span class="comment-text">{{ comment.content }}</span>
                    </div>
                </div>
                <button v-if="comment.user_id === user?.id" @click="handleDeleteComment(comment.id)" class="delete-comment-button">Delete</button>
            </div>
            <form @submit.prevent="handleAddComment" class="add-comment-form">
                <input v-model="newComment" placeholder="Add a comment..." required />
                <button type="submit">Post</button>
            </form>
        </div>
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
    emits: ['update-post', 'delete-post'],

    setup(props, { emit }) {
        const { user, fetchUser } = useAuth();
        const { toggleLike, addComment, deleteComment, deletePost } = usePosts();
        const newComment = ref('');

        // Fetch user from localStorage or API
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser);
            } catch (e) {
                console.error('Failed to parse user from storage');
            }
        } else {
            fetchUser();
        }

        const handleToggleLike = async () => {
            const originalPost = { ...props.post };
            const userId = user.value?.id;

            if (!userId) {
                console.error('User not authenticated');
                return;
            }

            // Optimistic update
            const isCurrentlyLiked = props.post.likes.some(like => like.user_id === userId);
            if (isCurrentlyLiked) {
                props.post.likes = props.post.likes.filter(like => like.user_id !== userId);
            } else {
                props.post.likes.push({ user_id: userId });
            }
            emit('update-post', { ...props.post });

            try {
                const updatedPost = await toggleLike(props.post.id);
                emit('update-post', updatedPost);
            } catch (error: any) {
                console.error('Like action failed:', error.message);
                emit('update-post', originalPost);
            }
        };

        const handleAddComment = async () => {
            try {
                const updatedPost = await addComment(props.post.id, newComment.value);
                newComment.value = '';
                emit('update-post', updatedPost);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        const handleDeleteComment = async (commentId: number) => {
            try {
                const updatedPost = await deleteComment(commentId);
                emit('update-post', updatedPost);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        const handleDeletePost = async () => {
            try {
                await deletePost(props.post.id);
                emit('delete-post', props.post.id);
            } catch (error: any) {
                console.error(error.message);
            }
        };

        return { user, newComment, handleToggleLike, handleAddComment, handleDeleteComment, handleDeletePost };
    },
});
</script>

<style scoped>
.post-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 500px;
    margin: 0 auto 20px;
}

.post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #4b5563;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.username {
    font-weight: 600;
    color: #111827;
}

.timestamp {
    font-size: 12px;
    color: #6b7280;
}

.post-content {
    color: #374151;
    margin-bottom: 16px;
    line-height: 1.5;
}

.post-image {
    width: 100%;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 16px;
}

.post-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.like-button {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: #4b5563;
    cursor: pointer;
    font-size: 14px;
}

.like-button:hover {
    color: #2563eb;
}

.like-icon {
    width: 20px;
    height: 20px;
}

.like-icon.liked {
    fill: #2563eb;
    color: #2563eb;
}

.comments-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 16px;
}

.comment {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.comment-content {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.comment-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #4b5563;
}

.comment-username {
    font-weight: 600;
    color: #111827;
    margin-right: 4px;
}

.comment-text {
    color: #374151;
}

.delete-comment-button {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 12px;
    cursor: pointer;
}

.delete-comment-button:hover {
    color: #b91c1c;
}

.add-comment-form {
    display: flex;
    gap: 8px;
    margin-top: 16px;
}

.add-comment-form input {
    flex: 1;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
}

.add-comment-form input:focus {
    outline: none;
    border-color: #2563eb;
}

.add-comment-form button {
    background: #2563eb;
    color: #ffffff;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
}

.add-comment-form button:hover {
    background: #1e40af;
}

.delete-post-button {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 14px;
    cursor: pointer;
}

.delete-post-button:hover {
    color: #b91c1c;
}
</style>