<template>
  <div class="layout page-wrap">
    <TopBar
      :is-mobile="isMobile"
      :username="authStore.user?.username"
      :balance="money(authStore.user?.balance)"
      :menu-options="menuOptions"
      :current-path="currentPath"
      :avatar="authStore.user?.avatar"
      @menu="showDrawer = true"
      @select="go"
      @logout="onLogout"
      @profile="showProfile = true"
    />

    <div class="main-area">
      <router-view />
    </div>

    <n-drawer v-model:show="showDrawer" placement="left" width="260">
      <n-drawer-content title="导航">
        <n-menu :options="menuOptions" :value="currentPath" @update:value="onDrawerSelect" />
        <n-button class="logout" tertiary type="error" block @click="onLogout">退出登录</n-button>
      </n-drawer-content>
    </n-drawer>

    <ProfileModal v-model:show="showProfile" :user="authStore.user" />
  </div>
</template>

<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NButton, NDrawer, NDrawerContent, NIcon, NMenu, useMessage, type MenuOption } from 'naive-ui';
import { GridOutline, CartOutline, CubeOutline, ReceiptOutline, WalletOutline } from '@vicons/ionicons5';
import TopBar from '@/components/TopBar.vue';
import ProfileModal from '@/components/ProfileModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { money } from '@/types/format';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();
const route = useRoute();
const message = useMessage();
const showDrawer = ref(false);
const showProfile = ref(false);
const isMobile = ref(window.innerWidth <= 900);

const icon = (iconComp: any) => () => h(NIcon, null, { default: () => h(iconComp) });

const menuOptions: MenuOption[] = [
  { label: '首页', key: '/dashboard', icon: icon(GridOutline) },
  { label: '饰品市场', key: '/market', icon: icon(CartOutline) },
  { label: '我的库存', key: '/inventory', icon: icon(CubeOutline) },
  { label: '购买与出售', key: '/orders', icon: icon(ReceiptOutline) },
  { label: '我的', key: '/wallet', icon: icon(WalletOutline) }
];

const currentPath = computed(() => route.path);

const go = (path: string) => {
  router.push(path);
};

const onDrawerSelect = (path: string) => {
  go(path);
  showDrawer.value = false;
};

const onLogout = async () => {
  await authStore.logout();
  message.success('已退出');
  router.replace('/auth');
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 900;
};

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  if (!authStore.user) {
    try {
      await authStore.loadCurrentUser();
    } catch {
      await authStore.logout();
      router.replace('/auth');
    }
  }
  // 初始化WebSocket连接
  notificationStore.connectWebSocket();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  // 断开WebSocket连接
  notificationStore.disconnectWebSocket();
});
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
}

.main-area {
  min-width: 0;
}

.logout {
  margin-top: 16px;
}
</style>
