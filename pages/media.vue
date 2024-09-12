<template>
    <v-main min-height="300">
        <v-card class="mx-auto " max-width="800">
            <v-container fluid>
                <v-row dense>
                    <v-col v-for="med, n in mediaList?.Media" :key="n" :cols="12" :lg="4">
                        <v-card :color="selection.indexOf(med.ID) == -1 ? '' : 'blue-grey-lighten-4'">
                            <v-img :src="`${useRuntimeConfig().public.baseThumb}/${med.Thumbnail}`" class="align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>
                                <v-card-title class="text-white" v-text="med.FileName"></v-card-title>
                            </v-img>
                            <v-card-subtitle class="text-grey-darken-4 d-flex">
                                {{ secondsToDuration(med.Duration) }}
                                <v-spacer></v-spacer>
                                {{ useHRSize(med.FileSize) }}
                            </v-card-subtitle>
                            <v-card-actions>
                                <a :href="getDlPath(med.ID)"><v-btn density="compact" color="medium-emphasis"
                                        icon="mdi-download"></v-btn></a>
                                <a :href="getWatchPath(med.ID, med.FileName)" target="_blank"><v-btn density="compact"
                                        color="medium-emphasis" icon="mdi-play-circle"></v-btn></a>
                                <a :href="getMXPath(med.ID, med.FileName)"><v-btn density="compact"
                                        color="medium-emphasis" icon="mdi-play-network"></v-btn></a>
                                <v-spacer></v-spacer>
                                <v-btn @click="revertSelection(med.ID)" density="compact"
                                    :color="selection.indexOf(med.ID) == -1 ? 'medium-emphasis' : 'blue-darken-4'"
                                    :icon="selection.indexOf(med.ID) == -1 ? 'mdi-radiobox-blank' : 'mdi-radiobox-marked'"></v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-pagination :length="totalPages" v-model="currentPage"></v-pagination>
            <v-overlay v-model="loadingState" class="align-center justify-center" persistent contained />
        </v-card>
        <v-btn icon="mdi-delete-empty" size="x-large" class="position-fixed" color="red" style="bottom:10px;right:10px"
            v-show="selection.length > 0" transition="scroll-x-reverse-transition"
            @click="deleteModelState = true"></v-btn>
        <delete-modal v-model:display="deleteModelState" :items="deleteItemComputed"
            @confirm="deleteMedia"></delete-modal>
    </v-main>
</template>

<script setup lang="ts">

interface MediaListType {
    Total: number
    Media: {
        FileName: string
        FileSize: number
        Thumbnail: string
        ID: string,
        Duration: number
    }[]
}
// ...
function getStreamPath(mediaID: string) {
    return useRuntimeConfig().public.baseStream + "/" + mediaID
}
function getWatchPath(mediaID: string, title: string) {
    return `/watch/?q=${mediaID}&n=${encodeURIComponent(title)}`
}
function getDlPath(mediaID: string) {
    return getStreamPath(mediaID) + "?d=true"
}
function getMXPath(mediaID: string, fileName: string) {
    return `intent:${getStreamPath(mediaID)}.m3u8#Intent;package=com.mxtech.videoplayer.ad;S.title=${encodeURI(fileName)};S.decode_mode=2;end`
}
async function deleteMedia() {
    loadingState.value = true
    let prmsList = <Array<Promise<any>>>[]
    mediaList.value?.Media.forEach(function (v) {
        if (selection.indexOf(v.ID) != -1) {
            prmsList.push(useAPI(useRuntimeConfig().public.baseApi + '/media/' + v.ID, { method: "DELETE" }))
        }
    })
    await Promise.all(prmsList)
    await mediaListRef()
    for (let i = 0; i < selection.length; i++) {
        selection.pop()
    }
    loadingState.value = false
}
function revertSelection(mediaID: string) {
    const index = selection.indexOf(mediaID);
    if (index === -1) {
        selection.push(mediaID);
    } else {
        selection.splice(index, 1);
    }
}
function secondsToDuration(seconds: number) {
    seconds = Number(seconds);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);

    const hDisplay = h > 9 ? h : "0" + h;
    const mDisplay = m > 9 ? m : "0" + m;
    const sDisplay = s > 9 ? s : "0" + s;
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
}
// ...
const pageSize = 9
const currentPage = ref(1)
const loadingState = ref(false)

const deleteModelState = ref<boolean>(false)
const selection = reactive<string[]>([])

const totalPages = computed(() => {
    return mediaList.value ? Math.ceil(mediaList.value.Total / pageSize) : 1
})
const apiQuery = computed(() => {
    return { "page": currentPage.value, "page_size": pageSize }
})
const deleteItemComputed = computed(() => {
    let i = <Array<String>>[]
    mediaList.value?.Media.forEach(function (v) {
        if (selection.indexOf(v.ID) != -1) {
            i.push(`${v.FileName} # ${useHRSize(v.FileSize)} # ${secondsToDuration(v.Duration)}`)
        }
    })
    return i
})
const { data: mediaList, refresh: mediaListRef } = await useAPI<MediaListType>(useRuntimeConfig().public.baseApi + '/media', {
    query: apiQuery,
    onRequest: () => {
        loadingState.value = true
    }, onResponse: () => {
        loadingState.value = false
    },
})
</script>