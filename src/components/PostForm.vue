<template>
    <div class="post-form-container">
        <form @submit.prevent="handleCreatePost">
            <div class="form-group">
                <textarea
                    v-model="content"
                    placeholder="What's on your mind?"
                    required
                ></textarea>
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
    setup() {
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
            } catch (err: any) {
                error.value = err.message;
            }
        };

        return { content, image, error, onFileChange, handleCreatePost };
    },
});
</script>

<style scoped>
.post-form-container {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 16px;
}

textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    resize: vertical;
    outline: none;
}

textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

input[type="file"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
}

button {
    background: #3b82f6;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
}

button:hover {
    background: #2563eb;
}

.error-message {
    color: #ef4444;
    font-size: 14px;
    margin-top: 8px;
}
</style>
