<template>
    <div class="post-card">
        <div class="post-header">
            <span class="username">{{ post.user.username }}</span>
            <span class="timestamp">{{ new Date(post.created_at).toLocaleString() }}</span>
        </div>
        <p class="post-content">{{ post.content }}</p>
        <img v-if="post.image" :src="'http://localhost:8000/storage/' + post.image" alt="Post image"
            class="post-image" />
        <div class="post-actions">
            <button @click="handleToggleLike" class="like-button">
                {{post.likes.some(like => like.user_id === user?.id) ? 'Unlike' : 'Like'}} ({{ post.likes.length }})
            </button>
        </div>
        <div class="comments-section">
            <div v-for="comment in post.comments" :key="comment.id" class="comment">
                <span><strong>{{ comment.user.name }}</strong>: {{ comment.content }}</span>
                <button v-if="comment.user_id === user?.id" @click="handleDeleteComment(comment.id)"
                    class="delete-comment-button">Delete</button>
            </div>
            <form @submit.prevent="handleAddComment" class="add-comment-form">
                <input v-model="newComment" placeholder="Add a comment..." required />
                <button type="submit">Comment</button>
            </form>
        </div>
        <button v-if="post.user_id === user?.id" @click="handleDeletePost" class="delete-post-button">Delete
            Post</button>
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
        const { user, fetchUser } = useAuth();
        const { toggleLike, addComment, deleteComment, deletePost } = usePosts();
        const newComment = ref('');


        // Ambil user dari localStorage saat setup
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser);
            } catch (e) {
                console.error('Failed to parse user from storage');
            }
        } else {
            // Optional: fetch dari server kalau localStorage kosong
            fetchUser();
        }



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

<style scoped>
.post-card {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.username {
    font-weight: bold;
    color: #1f2937;
}

.timestamp {
    font-size: 12px;
    color: #6b7280;
    margin-left: 8px;
}

.post-content {
    margin-bottom: 12px;
    color: #374151;
}

.post-image {
    width: 100%;
    border-radius: 6px;
    margin-bottom: 12px;
}

.post-actions {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.like-button {
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
}

.like-button:hover {
    color: #1d4ed8;
}

.comments-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
}

.comment {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.delete-comment-button {
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
}

.delete-comment-button:hover {
    color: #b91c1c;
}

.add-comment-form {
    margin-top: 12px;
}

.add-comment-form input {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
}

.add-comment-form input:focus {
    border-color: #3b82f6;
    outline: none;
}

.add-comment-form button {
    margin-top: 8px;
    background: #3b82f6;
    color: white;
    padding: 8px;
    width: 100%;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.add-comment-form button:hover {
    background: #2563eb;
}

.delete-post-button {
    margin-top: 12px;
    color: #ef4444;
    background: none;
    border: none;
    cursor: pointer;
}

.delete-post-button:hover {
    color: #b91c1c;
}
</style>
