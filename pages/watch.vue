<template>
    <v-container fluid class="my-auto">
        <v-row justify="center">
            <v-col style="max-width: 90vw; width: 100%;" lg="5">
                <v-sheet class="overflow-hidden">
                    <div class="text-body-2">{{ vidData?.Media.FileName }}</div>
                    <VideoPlayer :videoSrc="useURL().stream(vidID)"
                        :videoPoster="useURL().thumbnail(vidData?.Media.Thumbnail || '')"
                        :videoTitle="vidData?.Media.FileName"
                        :videoVtt="useURL().thumbnail(vidData?.Media.Vtt || '')" />
                </v-sheet>
                <div class="d-flex mt-2">
                    <v-row justify="space-between" class="overflow-hidden">
                        <v-col v-for="x in [vidData?.Next, vidData?.Back]" col="6" lg="4" class="overflow-hidden">
                            <a :href="useURL().watch(x?.ID || '')" class="text-decoration-none">
                                <v-img v-if="x?.ID" :src="useURL().thumbnail(x?.Thumbnail || '')" class="align-end px-1"
                                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="150px" cover>
                                    <div class="w-100 d-flex justify-space-between">
                                        <div class="text-white text-caption">{{ useDuration(x.Duration) }}
                                        </div>
                                        <div class="text-white text-caption">{{ useHRSize(x.FileSize) }}</div>
                                    </div>
                                </v-img>
                            </a>
                            <div class="text-caption text-grey-darken-2 overflow-hidden text-no-wrap">{{ x?.FileName }}
                            </div>
                        </v-col>
                    </v-row>
                </div>
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
    }
})

// ...
const route = useRoute();
const vidID = route.query.q ? String(Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : '';
const { data: vidData } = await useAPI<MediaInfoType>(useURL().media(vidID), {})
</script>