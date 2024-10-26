<template></template>

<script setup lang="ts">
import type { MediaType } from '~/types';
const router = useRouter()

const { data } = await useAPI<MediaType>(useRuntimeConfig().public.baseApi + '/media/rand', {})
navigateTo({
    path: '/watch',
    query: {
        q: data.value?.ID,
    }
})
</script>