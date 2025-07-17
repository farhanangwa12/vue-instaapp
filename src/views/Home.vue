<template>
    <div class="space-y-6">
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