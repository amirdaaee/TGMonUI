<template>
    <v-main min-height="300">
        <v-card class="mx-auto " max-width="800">
            <v-toolbar density="compact">
                <v-spacer></v-spacer>
                <v-btn @click="pageState.showThumb = !pageState.showThumb" icon>
                    <v-icon>{{ pageState.showThumb ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container fluid>
                <v-row dense>
                    <v-col v-for="med, n in mediaList?.Media" :key="n" :cols="12" :lg="4">
                        <media-card :media="med" :show-image="pageState.showThumb" :selectable="true" :dlable="true"
                            v-model:selected="pageState.selection[med.ID]" :has-job="hasJobComputed[med.ID]" />
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
import type { JobListType, MediaListType, MediaType } from '~/types';
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
const pageSize = 9
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
    return mediaList.value ? Math.ceil(mediaList.value.Total / pageSize) : 1
})
const mediaQuery = computed(() => {
    return { "page": pageState.currentPage, "page_size": pageSize }
})
const { data: mediaList, refresh: mediaListRef, status: mediaListStat } = await useAPI<MediaListType>(useRuntimeConfig().public.baseApi + '/media/', { query: mediaQuery })
const { data: jobList, refresh: jobListRef, status: jobListStat } = await useAPI<JobListType>(useRuntimeConfig().public.baseApi + '/job', {})
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
    let i = <Array<MediaType>>[]
    mediaList.value?.Media.forEach(function (v) {
        if (pageState.selection[v.ID]) {
            i.push(v)
        }
    })
    return i
})
const hasJobComputed = computed(() => {
    console.log(jobList.value)
    let res: Record<string, boolean> = {}
    if (!jobList.value) {
        return res
    }
    for (let index = 0; index < jobList.value.Job.length; index++) {
        res[jobList.value.Job[index].mediaID] = true
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
        prmsList.push(useAPI(useRuntimeConfig().public.baseApi + '/media/' + v.ID, { method: "DELETE" }))
    })
    await Promise.all(prmsList)
    await mediaListRef()
    clearSelection()
    pageState.isLoading = false
}
async function createThumbnail() {
    pageState.isLoading = true
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