<script setup lang="ts">
const props = defineProps({
  imgSrc: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    default: 200,
  },
  title: {
    type: String,
    required: true,
  },
});

</script>

<template>
  <v-img :src="props.imgSrc" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)"
    :height="props.height" cover>
    <div class="text-white text-subtitle-1 font-weight-medium ml-2 mb-1">{{ props.title }}</div>
  </v-img>
</template>

<style scoped></style>
