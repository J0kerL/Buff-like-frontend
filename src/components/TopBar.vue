<template>
  <header class="topbar glass-panel">
    <div class="left">
      <n-button quaternary circle v-if="isMobile" @click="$emit('menu')">
        <template #icon>
          <n-icon><MenuOutline /></n-icon>
        </template>
      </n-button>
      <div class="brand">Buff Trade</div>
      <nav v-if="!isMobile" class="nav-menu">
        <n-menu mode="horizontal" :options="menuOptions" :value="currentPath" @update:value="onSelect" />
      </nav>
    </div>
    <div class="right">
      <div class="user-info">
        <div class="hello">欢迎回来</div>
        <div class="user">{{ username || '用户' }}</div>
      </div>
      <n-tag type="success" round>余额 {{ balance }}</n-tag>
      <n-button v-if="!isMobile" tertiary type="error" @click="$emit('logout')">退出登录</n-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { MenuOutline } from '@vicons/ionicons5';
import { NButton, NIcon, NMenu, NTag, type MenuOption } from 'naive-ui';

defineProps<{
  username?: string;
  balance: string;
  isMobile: boolean;
  menuOptions: MenuOption[];
  currentPath: string;
}>();

const emit = defineEmits<{
  menu: [];
  select: [path: string];
  logout: [];
}>();

const onSelect = (path: string) => {
  emit('select', path);
};
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  margin-bottom: 14px;
  gap: 20px;
}

.left {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  min-width: 0;
}

.brand {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-menu {
  flex: 1;
  min-width: 0;
}

.nav-menu :deep(.n-menu) {
  background: transparent;
}

.nav-menu :deep(.n-menu-item) {
  padding: 0 20px;
  min-width: auto;
}

.nav-menu :deep(.n-menu-item-content) {
  padding: 0 !important;
}

.nav-menu :deep(.n-menu-item-content-header) {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: visible;
}

.nav-menu :deep(.n-menu-item .n-menu-item-content__icon) {
  flex-shrink: 0;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.user-info {
  text-align: right;
}

.hello {
  color: #64748b;
  font-size: 12px;
}

.user {
  font-weight: 700;
  font-size: 16px;
}
</style>
