<template>
  <video ref="videoPlayer" class="video-js vjs-default-skin vjs-16-9" controls preload="auto"></video>
</template>

<script setup lang="ts">
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  videoSrc: {
    type: String,
    required: true,
  },
});

const videoPlayer = ref<Element>();
let videoOptions = {
  controls: true,
  controlBar: { remainingTimeDisplay: { displayNegative: true } },
  sources: [
    {
      src: props.videoSrc,
      type: 'video/mp4'
    },
  ],
  nativeControlsForTouch: true,
  responsive: true,
  enableSmoothSeeking: true,
  fluid: true,
  preload: "auto"
  // spatialNavigation: { enabled: true, horizontalSeek: true },
}
let player: Player | null = null;
function setTimeStorage() {
  localStorage.setItem('lastWatchTime-' + props.videoSrc, player?.currentTime ? String(player.currentTime()) : "0");
}
onMounted(() => {
  if (videoPlayer) {
    player = videojs(videoPlayer.value!, videoOptions, () => {
      console.log('Player is ready');
    });
    const lt = localStorage.getItem('lastWatchTime-' + props.videoSrc)
    if (lt) {
      player.on(['durationchange'], () => { player?.currentTime(lt) });
    }
    player.on(['seeked', 'pause', 'play'], setTimeStorage);
    setInterval(setTimeStorage, 10000);
  } else {
    console.error('Player element not found');
  }
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});

</script>

<style>
@import 'video.js/dist/video-js.css';
</style>
