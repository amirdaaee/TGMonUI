<script setup lang="ts">
// import type Player from 'video.js/dist/types/player';
import Plyr from 'plyr';

const props = defineProps({
  videoSrc: {
    type: String,
    required: true,
  },
  videoPoster: {
    type: String,
    required: true,
  },
  videoVtt: {
    type: String,
    required: false,
  },
});
let player: Plyr | undefined
onMounted(() => {
  player = new Plyr('video', {
    previewThumbnails: { src: props.videoVtt, enabled: props.videoVtt ? true : false },
    debug: true,
    controls: ['rewind', 'fast-forward', 'play-large', 'progress', 'current-time', 'duration'],
    ratio: "16:9",

  });
})
onBeforeUnmount(() => {
  if (player) {
    player.destroy();
  }
});

</script>
<template>
  <video controls playsinline crossorigin="true" :poster="props.videoPoster">
    <source :src="props.videoSrc">
  </video>
</template>


<style>
@import 'plyr/dist/plyr.css';
</style>
