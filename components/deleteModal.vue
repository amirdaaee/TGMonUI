<template>
  <v-dialog max-width="500" v-model="display">
    <v-card prepend-icon="mdi-delete" title="Confirm to delete following items?" color="orange">
      <v-card-text>
        <ul>
          <li v-for="itm in items">{{ itm }}</li>
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

<script setup lang="ts">
const display = defineModel("display", { default: false });
const props = defineProps({
  items: {
    type: Array<String>,
    default: []
  }
})
defineEmits(['confirm'])
</script>
