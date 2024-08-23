<template>
    <v-containe fluid class="my-auto">
        <v-row justify="center">
            <v-col style="max-width: 90vw; width: 100%;" lg="5">
                <v-sheet>
                    <h3 class="align-self-start">{{ vidTitle }}</h3>
                    <VideoPlayer :videoSrc="useRuntimeConfig().public.baseStream + '/' + vidID"
                        :videoTitle="vidTitle" />
                </v-sheet>
            </v-col>
        </v-row>
    </v-containe>
</template>
<script setup lang="ts">
import VideoPlayer from '@/components/videoPlayer.vue';
import { useRoute } from 'vue-router';

definePageMeta({
    auth: {
        auth: false, unauthenticatedOnly: false,
    }
})


const route = useRoute();
const vidID = ref(route.query.q || '');
let vidTitle = ref(String(route.query.n) || '');
</script>