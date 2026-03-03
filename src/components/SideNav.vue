<template>
  <aside class="sidebar glass-panel">
    <div class="brand">{{ brand }}</div>
    <n-menu :options="menuOptions" :value="currentPath" @update:value="onSelect" />
    <div class="sidebar-footer">
      <n-button tertiary type="error" block @click="$emit('logout')">退出登录</n-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { NButton, NMenu, type MenuOption } from 'naive-ui';

withDefaults(
  defineProps<{
    brand?: string;
    currentPath: string;
    menuOptions: MenuOption[];
  }>(),
  {
    brand: 'Buff Trade'
  }
);

const emit = defineEmits<{
  select: [path: string];
  logout: [];
}>();

const onSelect = (path: string) => {
  emit('select', path);
};
</script>

<style scoped>
.sidebar {
  padding: 18px;
  position: sticky;
  top: 14px;
  height: calc(100vh - 28px);
  display: flex;
  flex-direction: column;
}

.brand {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.sidebar-footer {
  margin-top: auto;
}
</style>
