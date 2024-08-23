<template></template>
<script setup>
import { navigateTo } from 'nuxt/app';
import { onMounted } from 'vue';

onMounted(() => {
    navigateTo('/media');
});
</script>