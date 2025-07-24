<template>
    <v-container fluid class="my-auto">
        <v-row justify="center">
            <v-col style="max-width: 95vw; width: 100%;" lg="5" class="px-0">
                <v-card class="overflow-hidden" :key="vidData?.media!.iD" :disabled="pageState.disabled">
                    <template v-slot:prepend>
                        <v-btn size="small" href="/random" :icon="'mdi-dice-6'" color="primary" variant="tonal" />
                    </template>
                    <template v-slot:title class="ma-2">
                        <span class="text-subtitle-1 text-md-h6 font-weight-medium">{{ vidData?.media?.meta?.fileName
                        }}</span>
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
                            :videoPoster="useURL().thumbnail(vidData?.media?.sprite || vidData?.media?.thumbnail || '')"
                            :videoTitle="vidData?.media?.meta?.fileName"
                            :videoVtt="useURL().thumbnail(vidData?.media?.vtt || '')" />
                    </template>
                    <template v-slot:actions>
                        <v-row justify="space-between" class="w-100">
                            <v-col v-for="x in [nextVid, pervVid]" cols="6" lg="4">
                                <template v-if="x?.media?.iD">
                                    <NuxtLink :to="{ name: 'watch', query: { q: x.media.iD } }"
                                        class="text-decoration-none w-100">
                                        <media-image :img-src="useURL().thumbnail(x.media?.thumbnail ?? '')"
                                            :title="x.media.meta?.fileName ?? ''" @click="" :height="150" />
                                        <div
                                            class="text-caption text-grey-darken-2 overflow-hidden text-no-wrap w-100 d-flex justify-space-between">
                                            <div>{{ useDuration(x.media.meta?.duration ?? 0) }}</div>
                                            <div>{{ useHRSize(x.media.meta?.fileSize ?? 0) }}</div>
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
    <delete-modal v-model:display="pageState.showDeleteModal" :items="[vidData?.media!]"
        @confirm="deleteMedia"></delete-modal>
</template>
<script setup lang="ts">
import VideoPlayer from '@/components/videoPlayer.vue';
import { useRoute } from 'vue-router';
import type { WebMediaReadResType } from '~/gen/client/models/WebMediaReadResType';
import { MediaApi } from '~/gen/client';
import { computedAsync } from '@vueuse/core';

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
const mediaClient = new MediaApi(useClientConfig())
// ...
const route = useRoute();
const vidID = computed(() => route.query.q ? String(Array.isArray(route.query.q) ? route.query.q[0] : route.query.q) : '')
const { data: vidData } = useAsyncData<WebMediaReadResType>(() => mediaClient.apiMediaIdGet({ id: vidID.value }), { watch: [vidID] })
const nextVid = computedAsync(async () => vidData.value?.nextID ? await mediaClient.apiMediaIdGet({ id: vidData.value?.nextID! }) : null, null)
const pervVid = computedAsync(async () => vidData.value?.pervID ? await mediaClient.apiMediaIdGet({ id: vidData.value?.pervID! }) : null, null)

// ...
async function deleteMedia() {
    pageState.disabled = true
    await mediaClient.apiMediaIdDelete({ id: vidID.value })
    useRouter().push({ name: 'watch', query: { q: vidData.value?.nextID } })
    pageState.disabled = false
}
</script>