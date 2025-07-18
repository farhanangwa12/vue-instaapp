<template>
    <div class="container">
        <PostForm @new-data-added="handleNewDataAdded" />
        <PostList :new-data-added="newDataAdded" @reset-new-data="handleResetNewData" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PostForm from '../components/PostForm.vue';
import PostList from '../components/PostList.vue';

export default defineComponent({
    components: { PostForm, PostList },
    setup() {

        const newDataAdded = ref(false);
        const handleNewDataAdded = (value: boolean) => {
            newDataAdded.value = value; // Update nilai newDataAdded
        };


        const handleResetNewData = () => {
            newDataAdded.value = false; // Reset newDataAdded to false
        };

        return { handleNewDataAdded, handleResetNewData, newDataAdded };
    }
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    /* setara dengan Tailwind space-y-6 */
}
</style>
