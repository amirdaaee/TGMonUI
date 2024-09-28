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
        <v-fab size="large" icon="mdi-delete-empty" color="red" v-show="isAnySelected" @click="deleteModelState = true"
            absoulte app></v-fab>
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
// ...



</script>