<template>
    <div class="container">
        <PostForm />
        <PostList />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PostForm from '../components/PostForm.vue';
import PostList from '../components/PostList.vue';

export default defineComponent({
    components: { PostForm, PostList },
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* setara dengan Tailwind space-y-6 */
}
</style>
