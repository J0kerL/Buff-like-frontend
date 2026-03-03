<template>
  <component :is="tag" class="glass-panel panel" :class="{ padded }">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string;
    padded?: boolean;
  }>(),
  {
    tag: 'section',
    padded: true
  }
);
</script>

<style scoped>
.panel.padded {
  padding: 18px;
}
</style>
