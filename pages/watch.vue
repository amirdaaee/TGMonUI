<template>
    <v-container fluid class="my-auto">
        <v-row justify="center">
            <v-col style="max-width: 95vw; width: 100%;" lg="5" class="px-0">
                <v-card class="overflow-hidden" :key="vidData?.Media.ID" :disabled="pageState.disabled">
                    <template v-slot:prepend>
                        <v-btn size="small" href="/random" :icon="'mdi-dice-6'" color="primary" variant="tonal" />
                    </template>
                    <template v-slot:title class="ma-2">
                        <span class="text-subtitle-1 text-md-h6 font-weight-medium">{{ vidData?.Media.FileName }}</span>
                    </template>
                    <template v-slot:append>
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-menu-down" color="primary" size="sm" v-bind="props" variant="tonal" />
                            </template>
                            <v-list>
                                <v-list-item prepend-icon="mdi-delete-empty" title="Delete" lines="one"
                                    @click="pageState.showDeleteModal = true" />
                            </v-list>
                        </v-menu>
                    </template>
                    <template v-slot:text>
                        <VideoPlayer :videoSrc="useURL().stream(vidID)"
                            :videoPoster="useURL().thumbnail(vidData?.Media.Sprite || vidData?.Media.Thumbnail || '')"
                            :videoTitle="vidData?.Media.FileName"
                            :videoVtt="useURL().thumbnail(vidData?.Media.Vtt || '')" />
                    </template>
                    <template v-slot:actions>
                        <v-row justify="space-between" class="w-100">
                            <v-col v-for="x in [vidData?.Next, vidData?.Back]" cols="6" lg="4">
                                <template v-if="x?.ID">
                                    <NuxtLink :to="{ name: 'watch', query: { q: x.ID } }"
                                        class="text-decoration-none w-100">
                                        <media-image :img-src="useURL().thumbnail(x.Thumbnail)" :title="x.FileName"
                                            @click="" :height="150" />
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
    <delete-modal v-model:display="pageState.showDeleteModal" :items="[vidData?.Media!]"
        @confirm="deleteMedia"></delete-modal>
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
const pageState = reactive({
    showDeleteModal: false,
    disabled: false
})
// ...
const route = useRoute();
const vidID = computed(() => route.query.q ? String(Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : '')
const { data: vidData } = await useAPI<MediaInfoType>(() => useURL().media(vidID.value), {})
// ...
async function deleteMedia() {
    pageState.disabled = true
    await useAPI(useRuntimeConfig().public.baseApi + '/media/' + vidData.value?.Media.ID, { method: "DELETE" })
    useRouter().push({ name: 'watch', query: { q: vidData.value?.Back.ID } })
    pageState.disabled = false
}
</script>