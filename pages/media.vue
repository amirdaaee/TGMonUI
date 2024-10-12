<template>
    <v-main min-height="300">
        <v-card class="mx-auto " max-width="800">
            <v-toolbar density="compact">
                <v-spacer></v-spacer>
                <v-btn @click="showThumb = !showThumb" icon>
                    <v-icon>{{ showThumb ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row dense>
                    <v-col v-for="med, n in mediaList?.Media" :key="n" :cols="12" :lg="4">
                        <media-card :media="med" :show-image="showThumb" :selectable="true" :dlable="true"
                            v-model:selected="selection[med.ID]" />
                    </v-col>
                </v-row>
            </v-container>
            <v-pagination size="" :length="totalPages" v-model="currentPage" total-visible="4"></v-pagination>
            <v-overlay v-model="loadingState" class="align-center justify-center" persistent contained />
        </v-card>
        <delete-modal v-model:display="deleteModelState" :items="selectedItemComputed"
            @confirm="deleteMedia"></delete-modal>
        <!-- <v-fab size="large" icon="mdi-delete-empty" color="red" v-show="isAnySelected" @click="deleteModelState = true"
            absoulte app></v-fab> -->
        <v-speed-dial transition="fade-transition" location="top right" :offset="0" v-if="isAnySelected">
            <template v-slot:activator="{ props: activatorProps }">
                <v-fab v-bind="activatorProps" size="large" icon="$vuetify" color="light-blue-darken-4" absoulte
                    app></v-fab>
            </template>
            <v-btn key="1" icon="mdi-delete-empty" color="red" @click="deleteModelState = true" absoulte app />
            <v-btn key="2" icon="mdi-eye" color="yellow" @click="createThumbnail" absoulte app />
        </v-speed-dial>\
        <v-snackbar v-model="showSnackbar" :timeout="2000" :color="snackbarColor">{{ snackbarText }}</v-snackbar>
    </v-main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { MediaListType, MediaType } from '~/types';
const router = useRouter()
// ...
const pageSize = 9
const currentPage = ref(Number(useRoute().query.page) || 1)
const loadingState = ref(false)
const deleteModelState = ref<boolean>(false)
const showSnackbar = ref<boolean>(false)
const snackbarColor = ref<string>("")
const snackbarText = ref<string>("")
const showThumb = ref<boolean>(Boolean(useRoute().query.d == "0" ? false : true))
const selection: { [id: string]: boolean; } = reactive({});
const totalPages = computed(() => {
    return mediaList.value ? Math.ceil(mediaList.value.Total / pageSize) : 1
})
const apiQuery = computed(() => {
    return { "page": currentPage.value, "page_size": pageSize }
})
const { data: mediaList, refresh: mediaListRef } = await useAPI<MediaListType>(useRuntimeConfig().public.baseApi + '/media', {
    query: apiQuery,
    onRequest: () => {
        loadingState.value = true
    }, onResponse: () => {
        loadingState.value = false
    },
})
// ...
watch(currentPage, (newValue) => {
    router.push({ query: { page: newValue } })
})
watch(showThumb, (newValue) => {
    router.push({ query: { d: (newValue ? 1 : 0) } })
})
const isAnySelected = computed(() => {
    for (let key in selection) {
        if (selection[key]) {
            return true
        }
    }
    return false
})
const selectedItemComputed = computed(() => {
    let i = <Array<MediaType>>[]
    mediaList.value?.Media.forEach(function (v) {
        if (selection[v.ID]) {
            i.push(v)
        }
    })
    return i
})
// ...
function clearSelection() {
    for (let key in selection) {
        selection[key] = false
    }
}
async function deleteMedia() {
    loadingState.value = true
    let prmsList = <Array<Promise<any>>>[]
    selectedItemComputed.value.forEach(function (v) {
        prmsList.push(useAPI(useRuntimeConfig().public.baseApi + '/media/' + v.ID, { method: "DELETE" }))
    })
    await Promise.all(prmsList)
    await mediaListRef()
    clearSelection()
    loadingState.value = false
}
async function createThumbnail() {
    loadingState.value = true
    let idList = <Array<string>>[]
    selectedItemComputed.value.forEach(function (v) {
        idList.push(v.ID)
    })
    let jobs: any[] = []
    idList.forEach((x) => {
        jobs.push({
            "mediaID": x,
            "type": "THUMBNAIL"
        })
    })
    let res = await useAPI(useRuntimeConfig().public.baseApi + '/job/', { method: "POST", body: { "job": jobs } })

    if (res.error.value != null) {
        snack("error sending request", "red")
    } else {
        snack("request sent", "green")
        clearSelection()
    }
    loadingState.value = false
}
function snack(message: string, color: string) {
    snackbarColor.value = color
    snackbarText.value = message
    showSnackbar.value = true
}
// ...



</script>