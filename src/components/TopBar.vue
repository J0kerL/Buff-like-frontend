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
      <n-tag type="success" round>余额 {{ balance }}</n-tag>
      <n-dropdown :options="dropdownOptions" @select="onDropdownSelect" trigger="hover" placement="bottom-end">
        <div class="user-dropdown-trigger">
          <n-avatar
            round
            :size="36"
            :src="avatar"
            :fallback-src="defaultAvatar"
          />
          <span class="username">{{ username || '用户' }}</span>
          <n-icon size="16"><ChevronDownOutline /></n-icon>
        </div>
      </n-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { MenuOutline, ChevronDownOutline, PersonCircleOutline, LogOutOutline } from '@vicons/ionicons5';
import { NButton, NIcon, NMenu, NTag, NAvatar, NDropdown, type MenuOption } from 'naive-ui';

defineProps<{
  username?: string;
  balance: string;
  isMobile: boolean;
  menuOptions: MenuOption[];
  currentPath: string;
  avatar?: string;
}>();

const emit = defineEmits<{
  menu: [];
  select: [path: string];
  logout: [];
  profile: [];
}>();

const defaultAvatar = 'https://07ec-86-36-80-22.ngrok-free.app/buff/default-avatar.png';

const onSelect = (path: string) => {
  emit('select', path);
};

const renderIcon = (icon: any) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const dropdownOptions = [
  {
    label: '个人中心',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline)
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
];

const onDropdownSelect = (key: string) => {
  if (key === 'profile') {
    emit('profile');
  } else if (key === 'logout') {
    emit('logout');
  }
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

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-dropdown-trigger:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.username {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
