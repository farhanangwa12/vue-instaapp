<template>
    <div class="bg-white p-6 rounded-lg shadow-md">
        <form @submit.prevent="handleCreatePost">
            <div class="mb-4">
                <textarea v-model="content" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="What's on your mind?" required></textarea>
            </div>
            <div class="mb-4">
                <input type="file" accept="image/*" @change="onFileChange" class="w-full p-2 border rounded-md" />
            </div>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Post</button>
            <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
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