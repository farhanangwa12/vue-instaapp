<template>
    <div class="post-form-container">
        <form @submit.prevent="handleCreatePost">
            <div class="form-group">
                <textarea v-model="content" placeholder="What's on your mind?" required></textarea>
            </div>
            <div class="form-group">
                <input type="file" accept="image/*" @change="onFileChange" />
            </div>
            <button type="submit">Post</button>
            <p v-if="error" class="error-message">{{ error }}</p>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { usePosts } from '../composables/usePosts';

export default defineComponent({
    emits: ['new-data-added'],
    setup(props, { emit }) {
        const content = ref('');
        const image = ref<File | null>(null);
        const error = ref('');
        const { createPost } = usePosts();

        const onFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                image.value = target.files[0];
            }
        };

        const handleCreatePost = async () => {
            try {
                await createPost(content.value, image.value);
                content.value = '';
                image.value = null;
                error.value = '';
                // Emit event setelah post berhasil
                emit('new-data-added', true);
            } catch (err: any) {
                error.value = err.message;
                emit('new-data-added', false); // Emit false jika gagal
            }
        };

        return { content, image, error, onFileChange, handleCreatePost };
    },
});
</script>

<style scoped>
.post-form-container {
    flex-grow: 1;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 600px;
    margin: 0 auto 20px;
    min-width: 500px;
}

.form-group {
    margin-bottom: 16px;
}

textarea {
    width: 95%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    resize: vertical;
    font-size: 14px;
    color: #374151;
    min-height: 100px;
}

textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

input[type="file"] {
    width: 95%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    color: #374151;
}

input[type="file"]::-webkit-file-upload-button {
    background: #e5e7eb;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    color: #374151;
}

input[type="file"]::-webkit-file-upload-button:hover {
    background: #d1d5db;
}

button {
    background: #2563eb;
    color: #ffffff;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
}

button:hover {
    background: #1e40af;
}

.error-message {
    color: #ef4444;
    font-size: 14px;
    margin-top: 12px;
    text-align: center;
}
</style>