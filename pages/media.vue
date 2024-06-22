<template>
    <v-main class="" style="min-height: 300px;">
        <v-card class="mx-auto" max-width="800">
            <v-container fluid>
                <v-row dense>
                    <v-col v-for="med, n in mediaList?.Media" :key="n" :cols="12" :lg="4">
                        <v-card>
                            <v-img :src="'data:image/gif;base64,' + med.Thumbnail" class="align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
                                <v-card-title class="text-white" v-text="med.FileName"></v-card-title>
                            </v-img>
                            <v-card-subtitle class="text-grey-darken-4"
                                v-text="useHRSize(med.FileSize)"></v-card-subtitle>
                            <v-card-actions>
                                <a :href="getDlPath(med.ID)"><v-btn density="compact" color="medium-emphasis"
                                        icon="mdi-download"></v-btn></a>
                                <a :href="getStreamPath(med.ID)" target="_blank"><v-btn density="compact"
                                        color="medium-emphasis" icon="mdi-play-circle"></v-btn></a>
                                <a :href="getMXPath(med.ID, med.FileName)"><v-btn density="compact"
                                        color="medium-emphasis" icon="mdi-play-network"></v-btn></a>
                                <v-spacer></v-spacer>
                                <v-btn @click="deleteOverlays[n] = true" density="compact" color="medium-emphasis"
                                    icon="mdi-delete"></v-btn>
                            </v-card-actions>

                            <v-overlay v-model="deleteOverlays[n]" class="align-center justify-center"
                                :persistent="deletingState[n]" contained>
                                <v-btn color="red" @click="deletingState[n] = true; deleteMedia(med.ID)"
                                    :disabled="deletingState[n]">
                                    Confirm
                                </v-btn>
                            </v-overlay>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-pagination :length="totalPages" v-model="currentPage"></v-pagination>
            <v-overlay v-model="loadingState" class="align-center justify-center" :persistent="true" contained>
            </v-overlay>
        </v-card>
    </v-main>
</template>

<script setup lang="ts">
interface MediaListType {
    Total: number
    Media: {
        FileName: string
        FileSize: number
        Thumbnail: string
        ID: string
    }[]
}
// ...
function getStreamPath(mediaID: string) {
    return useRuntimeConfig().public.streamBase + "/" + mediaID
}
function getDlPath(mediaID: string) {
    return getStreamPath(mediaID) + "?d=true"
}
function getMXPath(mediaID: string, fileName: string) {
    return `intent:${getStreamPath(mediaID)}.m3u8#Intent;package=com.mxtech.videoplayer.ad;S.title=${encodeURI(fileName)};S.decode_mode=2;end`
}
async function deleteMedia(mediaID: string) {
    await useAPI(useRuntimeConfig().public.apiBase + '/media/' + mediaID, { method: "DELETE" })
    mediaList.value!.Total -= 1
    currentPage.value = Math.min(totalPages.value, currentPage.value)
    await mediaListRef()
    resetState()
}
function resetState() {
    deleteOverlays.fill(false, 0, mediaList.value!.Total)
    deletingState.fill(false, 0, mediaList.value!.Total)
}

// ...
const pageSize = 9
const currentPage = ref(1)
const loadingState = ref(false)
const deleteOverlays = reactive<boolean[]>([])
const deletingState = reactive<boolean[]>([])

const totalPages = computed(() => {
    return mediaList.value ? Math.ceil(mediaList.value.Total / pageSize) : 1
})
const apiQuery = computed(() => {
    return { "page": currentPage.value, "page_size": pageSize }
})
const {
    status,
    data,
    token,
} = useAuth()
const { data: mediaList, refresh: mediaListRef } = await useAPI<MediaListType>(useRuntimeConfig().public.apiBase + '/media', {
    query: apiQuery,
    onRequest: () => {
        loadingState.value = true
    }, onResponse: () => {
        loadingState.value = false
    },
})
</script>