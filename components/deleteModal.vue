<script setup lang="ts">
import type { MediaType } from '~/types';

const display = defineModel("display", { default: false });
const props = defineProps({
  items: {
    type: Array<MediaType>,
    default: []
  }
})
defineEmits(['confirm'])
</script>

<template>
  <v-dialog max-width="500" v-model="display">
    <v-card prepend-icon="mdi-delete" title="Confirm to delete following items?" color="orange-lighten-1">
      <v-card-text>
        <ul>
          <li v-for="itm in items">
            <span class="text-body-1">{{ itm.FileName }}</span>
            <v-chip density="comfortable" size="small" color="deep-purple-darken-1" class="ml-1">
              {{ useDuration(itm.Duration) }}
            </v-chip>
            <v-chip density="comfortable" size="small" color="deep-purple-darken-1" class="ml-1">
              {{ useHRSize(itm.FileSize) }}
            </v-chip>
          </li>
        </ul>
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="display = false">
          No
        </v-btn>
        <v-btn @click="$emit('confirm'); display = false">
          Yes
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
