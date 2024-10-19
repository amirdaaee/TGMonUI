<template>
    <v-container fluid class="my-auto">
        <v-row justify="center">
            <v-col style="max-width: 90vw; width: 100%;" lg="5">
                <v-card class="overflow-hidden" :key="vidData?.Media.ID">
                    <template v-slot:title>
                        <span>{{ vidData?.Media.FileName }}</span>
                    </template>
                    <template v-slot:text>
                        <VideoPlayer :videoSrc="useURL().stream(vidID)"
                            :videoPoster="useURL().thumbnail(vidData?.Media.Sprite || vidData?.Media.Thumbnail || '')"
                            :videoTitle="vidData?.Media.FileName"
                            :videoVtt="useURL().thumbnail(vidData?.Media.Vtt || '')" />
                    </template>
                    <template v-slot:actions>
                        <v-row justify="space-between" class="px-2">
                            <v-col v-for="x in [vidData?.Next, vidData?.Back]" col="6" lg="4">
                                <template v-if="x?.ID">
                                    <NuxtLink :to="{ name: 'watch', query: { q: x.ID } }" class="text-decoration-none"
                                        replace>
                                        <media-image :img-src="useURL().thumbnail(x.Thumbnail)" :title="x.FileName"
                                            @click="" />
                                        <div
                                            class="text-caption text-grey-darken-2 overflow-hidden text-no-wrap w-100 d-flex justify-space-between">
                                            <div>{{ useDuration(x.Duration) }}</div>
                                            <div>{{ useHRSize(x.FileSize) }}</div>
                                        </div>
                                    </NuxtLink>
                                </template>
                            </v-col>
                        </v-row>
                    </template>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import VideoPlayer from '@/components/videoPlayer.vue';
import { useRoute } from 'vue-router';
import type { MediaInfoType } from '~/types';

definePageMeta({
    auth: {
        auth: false, unauthenticatedOnly: false,
    },
    layout: 'dark'
})

// ...
const route = useRoute();
const vidID = computed(() => route.query.q ? String(Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : '')
const { data: vidData, refresh: vidDataRef } = await useAPI<MediaInfoType>(() => useURL().media(vidID.value), {})

watch(vidID, () => {
    vidDataRef()
})
</script>