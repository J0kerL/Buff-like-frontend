<template>
  <div class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>
