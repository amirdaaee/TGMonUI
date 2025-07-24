<template></template>

<script setup lang="ts">
import { DefaultApi } from '~/gen/client';
const router = useRouter()
const mediaClient = new DefaultApi(useClientConfig())
const randomRes = await mediaClient.apiMediaRandomGet()
navigateTo({
    path: '/watch',
    query: {
        q: randomRes?.mediaID,
    }
})
</script>