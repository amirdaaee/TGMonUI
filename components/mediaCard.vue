<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { TypesMediaFileDoc } from '~/gen/client/models/TypesMediaFileDoc';

const { mdAndDown } = useDisplay()
const props = withDefaults(defineProps<{
  media: TypesMediaFileDoc,
  showImage?: boolean
  selectable?: boolean,
  dlable?: boolean,
  intentable?: boolean,
  hasJob: boolean,
}>(), {
  showImage: true,
  hasJob: false,
})
const isSelected = defineModel<boolean>("selected")
const showOverlay = ref<boolean>(false)
// ...
function getThumbPath(mediaID: string | undefined) {
  if (props.showImage && mediaID) {
    return useURL().thumbnail(mediaID)
  }
  return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png"
}
function getStreamPath(mediaID: string) {
  return useURL().stream(mediaID)
}
function getDlPath(mediaID: string) {
  return getStreamPath(mediaID) + "?d=true"
}
function getIntent(mediaID: string, fileName: string, intentTarget: string, extra: string = "") {
  const streamPath = getStreamPath(mediaID)
  let u = new URL(streamPath)
  if (u.origin == "") {
    u = new URL(streamPath, window.location.origin)
  }
  return `intent:${u.toString()}.mp4#Intent;${extra}package=${intentTarget};end`
}
function getMXPath(mediaID: string, fileName: string) {
  return getIntent(mediaID, fileName, "com.mxtech.videoplayer.ad", `S.title=${encodeURI(fileName)};`)
}
function getKMPath(mediaID: string, fileName: string) {
  return getIntent(mediaID, fileName, "com.kmplayer")
}
function revertSelection() {
  isSelected.value = !isSelected.value
}
function showVTT() {
  if (props.showImage) {
    showOverlay.value = true
  }
}
</script>

<template>
  <v-card :color="isSelected ? 'blue-grey-lighten-4' : ''">
    <media-image :img-src="getThumbPath(props.media.thumbnail)" :title="props.media.meta?.fileName ?? ''"
      @click="showVTT" />
    <v-card-subtitle class="text-grey-darken-4 d-flex">
      {{ useDuration(props.media.meta?.duration ?? 0) }}
      <v-icon v-if="hasJob" icon="mdi-cog" size="small" class="ml-1" color="light-blue-darken-4"></v-icon>
      <v-icon v-if="media.sprite" icon="mdi-filmstrip-box-multiple" size="small" class="ml-1"
        color="light-blue-darken-4"></v-icon>
      <v-spacer></v-spacer>
      {{ useHRSize(props.media.meta?.fileSize ?? 0) }}
    </v-card-subtitle>
    <v-card-actions>
      <a v-if="props.dlable" :href="getDlPath(props.media.iD!)"><v-btn density="compact" color="medium-emphasis"
          icon="mdi-download"></v-btn></a>
      <a :href="useURL().watch(props.media.iD!)" target="_blank"><v-btn density="compact" color="medium-emphasis"
          icon="mdi-play-circle"></v-btn></a>

      <v-menu scroll-strategy="close" v-if="props.intentable">
        <template v-slot:activator="{ props }">
          <v-btn density="compact" color="medium-emphasis" icon="mdi-play-network" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item :href="getKMPath(props.media.iD!, props.media.meta?.fileName!)">
            <v-list-item-title v-text="'KM player'" />
          </v-list-item>
          <v-list-item :href="getMXPath(props.media.iD!, props.media.meta?.fileName!)">
            <v-list-item-title v-text="'MX player'" />
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-btn @click="revertSelection()" density="compact" v-if="props.selectable"
        :color="isSelected ? 'blue-darken-4' : 'medium-emphasis'"
        :icon="isSelected ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"></v-btn>
    </v-card-actions>
    <v-overlay v-model="showOverlay" class="align-center justify-center w-100" opacity="0.8" close-on-content-click>
      <v-img :src="props.media.sprite ? getThumbPath(props.media.sprite) : getThumbPath(props.media.thumbnail)"
        :width="mdAndDown ? '100vw' : '40vw'" />
    </v-overlay>
  </v-card>
</template>

<style scoped></style>
