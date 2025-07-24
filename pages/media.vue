<template>
    <v-main min-height="300">
        <v-card class="mx-auto " max-width="800">
            <v-toolbar density="compact">
                <v-spacer></v-spacer>
                <v-btn @click="pageState.showThumb = !pageState.showThumb" icon>
                    <v-icon>{{ pageState.showThumb ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                </v-btn>
                <v-btn href="/random" target="_blank" :icon="'mdi-dice-6'" />
            </v-toolbar>
            <v-container fluid>
                <v-row dense>
                    <v-col v-for="med, n in mediaList?.media" :key="n" :cols="12" :sm="6" :lg="4">
                        <media-card :media="med" :show-image="pageState.showThumb" :selectable="true" :dlable="true"
                            v-model:selected="pageState.selection[med.iD!]" :has-job="hasJobComputed[med.iD!]" />
                    </v-col>
                </v-row>
            </v-container>
            <v-pagination size="" :length="totalPages" v-model="pageState.currentPage" total-visible="4"></v-pagination>
            <v-overlay v-model="pageState.isLoading" class="align-center justify-center" persistent contained />
        </v-card>
        <delete-modal v-model:display="pageState.showDeleteModel" :items="selectedItemComputed"
            @confirm="deleteMedia"></delete-modal>
        <v-speed-dial transition="fade-transition" location="top right" :offset="0" v-if="isAnySelected">
            <template v-slot:activator="{ props: activatorProps }">
                <v-fab v-bind="activatorProps" size="large" icon="$vuetify" color="light-blue-darken-4" absoulte
                    app></v-fab>
            </template>
            <v-btn key="1" icon="mdi-delete-empty" color="red" @click="pageState.showDeleteModel = true" absoulte app />
            <v-btn key="2" icon="mdi-eye" color="yellow" @click="createThumbnail" absoulte app />
        </v-speed-dial>\
        <v-snackbar v-model="pageState.showSnackbar" :timeout="2000" :color="pageState.snackbarColor">{{
            pageState.snackbarText
            }}</v-snackbar>
    </v-main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { JobReqApi, MediaApi } from '~/gen/client';
import type { TypesMediaFileDoc } from '~/gen/client/models/TypesMediaFileDoc';
const router = useRouter()
// ...
interface PageState {
    currentPage: number;
    showDeleteModel: boolean;
    showSnackbar: boolean;
    showThumb: boolean;
    snackbarColor: string;
    snackbarText: string;
    selection: Record<string, boolean>;
    isLoading: boolean;
}

// ...
const pageSize = 12
const pageState = reactive<PageState>({
    currentPage: Number(useRoute().query.page) || 1,
    showDeleteModel: false,
    showSnackbar: false,
    showThumb: Boolean(useRoute().query.d == "0" ? false : true),
    snackbarColor: "",
    snackbarText: "",
    selection: {},
    isLoading: false,


})
const totalPages = computed(() => {
    return mediaList.value ? Math.ceil((mediaList.value.total ?? 0) / pageSize) : 1
})
const mediaQuery = computed(() => {
    return { "page": pageState.currentPage, "page_size": pageSize }
})
const mediaClient = new MediaApi(useClientConfig())
const jobReqClient = new JobReqApi(useClientConfig())


const { data: mediaList, refresh: mediaListRef, status: mediaListStat } = await useAsyncData(() => mediaClient.apiMediaGet({ page: mediaQuery.value.page - 1 }), { watch: [mediaQuery] })
const { data: jobList, refresh: jobListRef, status: jobListStat } = await useAsyncData(() => jobReqClient.apiJobReqGet({}))
// ...
watch(() => pageState.currentPage, (newValue) => {
    router.push({ query: { page: newValue } })
})
watch(() => pageState.showThumb, (newValue) => {
    router.push({ query: { d: (newValue ? 1 : 0) } })
})
watch(() => [mediaListStat.value, jobListStat.value], (newValue) => {
    pageState.isLoading = (newValue[0] == "pending" || newValue[1] == "pending")
})
const isAnySelected = computed(() => {
    for (let key in pageState.selection) {
        if (pageState.selection[key]) {
            return true
        }
    }
    return false
})
const selectedItemComputed = computed(() => {
    let i = <Array<TypesMediaFileDoc>>[]
    mediaList.value?.media?.forEach(function (v) {
        if (pageState.selection[v.iD!]) {
            i.push(v)
        }
    })
    return i
})
const hasJobComputed = computed(() => {
    let res: Record<string, boolean> = {}
    if (!jobList.value) {
        return res
    }
    for (let index = 0; index < jobList.value.length; index++) {
        res[jobList.value[index].mediaID!] = true
    }
    console.log(jobList.value)
    return res
})
// ...
function clearSelection() {
    for (let key in pageState.selection) {
        pageState.selection[key] = false
    }
}
async function deleteMedia() {
    pageState.isLoading = true
    let prmsList = <Array<Promise<any>>>[]
    selectedItemComputed.value.forEach(function (v) {
        mediaClient.apiMediaIdDelete
        prmsList.push(mediaClient.apiMediaIdDelete({ id: v.iD! }))
    })
    await Promise.all(prmsList)
    await mediaListRef()
    clearSelection()
    pageState.isLoading = false
}
async function createThumbnail() {
    pageState.isLoading = true
    let prmsList = <Array<Promise<any>>>[]
    selectedItemComputed.value.forEach(function (v) {
        prmsList.push(jobReqClient.apiJobReqPost({ data: { mediaID: v.iD!, type: "THUMBNAIL" } }))
    })
    let res = await Promise.allSettled(prmsList)
    if (res.some((x) => x.status == "rejected")) {
        snack("error sending request", "red")
    } else {
        snack("request sent", "green")
        clearSelection()
        jobListRef()
    }
    pageState.isLoading = false
}
function snack(message: string, color: string) {
    pageState.snackbarColor = color
    pageState.snackbarText = message
    pageState.showSnackbar = true
}
// ...



</script>