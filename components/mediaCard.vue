<script setup lang="ts">
import type { MediaType } from '~/types';

const props = withDefaults(defineProps<{
  media: MediaType,
  showImage?: boolean
  selectable?: boolean,
  dlable?: boolean,
  intentable?: boolean,
}>(), {
  showImage: true,
})
const isSelected = defineModel<boolean>("selected")
// ...
function getThumbPath(mediaID: string) {
  if (props.showImage) {
    return useURL().thumbnail(mediaID)
  }
  return "https://davooda.com/images/basic/basic-gallery-photos-pictures-icon.svg"
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
</script>

<template>
  <v-card :color="isSelected ? 'blue-grey-lighten-4' : ''">
    <media-image :img-src="getThumbPath(props.media.Thumbnail)" :title="props.media.FileName" />
    <v-card-subtitle class="text-grey-darken-4 d-flex">
      {{ useDuration(props.media.Duration) }}
      <v-spacer></v-spacer>
      {{ useHRSize(props.media.FileSize) }}
    </v-card-subtitle>
    <v-card-actions>
      <a v-if="props.dlable" :href="getDlPath(props.media.ID)"><v-btn density="compact" color="medium-emphasis"
          icon="mdi-download"></v-btn></a>
      <a :href="useURL().watch(props.media.ID)" target="_blank"><v-btn density="compact" color="medium-emphasis"
          icon="mdi-play-circle"></v-btn></a>

      <v-menu scroll-strategy="close" v-if="props.intentable">
        <template v-slot:activator="{ props }">
          <v-btn density="compact" color="medium-emphasis" icon="mdi-play-network" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item :href="getKMPath(props.media.ID, props.media.FileName)">
            <v-list-item-title v-text="'KM player'" />
          </v-list-item>
          <v-list-item :href="getMXPath(props.media.ID, props.media.FileName)">
            <v-list-item-title v-text="'MX player'" />
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-btn @click="revertSelection()" density="compact" v-if="props.selectable"
        :color="isSelected ? 'blue-darken-4' : 'medium-emphasis'"
        :icon="isSelected ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
