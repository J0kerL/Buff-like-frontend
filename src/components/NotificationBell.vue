<template>
  <n-popover trigger="click" placement="bottom-end" :width="360" @update:show="onPopoverChange">
    <template #trigger>
      <n-badge :value="unreadCount" :max="99" :show="unreadCount > 0">
        <n-button quaternary circle class="bell-btn">
          <template #icon>
            <n-icon size="20"><NotificationsOutline /></n-icon>
          </template>
        </n-button>
      </n-badge>
    </template>

    <div class="notification-panel">
      <div class="panel-header">
        <span class="title">通知</span>
        <span class="count" v-if="unreadCount > 0">{{ unreadCount }} 条未读</span>
      </div>

      <n-scrollbar style="max-height: 400px">
        <div class="notification-list" v-if="notifications.length > 0">
          <div
            v-for="item in notifications"
            :key="item.id"
            class="notification-item"
            :class="{ unread: !item.isRead }"
            @click="handleClick(item)"
          >
            <div class="item-header">
              <span class="item-title">{{ item.title }}</span>
              <n-button text size="tiny" @click.stop="handleDelete(item.id)">
                <template #icon>
                  <n-icon><CloseOutline /></n-icon>
                </template>
              </n-button>
            </div>
            <div class="item-content">{{ item.content }}</div>
            <div class="item-footer">
              <span class="item-time">{{ formatTime(item.createTime) }}</span>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <n-empty description="暂无通知" />
        </div>
      </n-scrollbar>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NBadge, NButton, NEmpty, NIcon, NPopover, NScrollbar, useMessage } from 'naive-ui';
import { NotificationsOutline, CloseOutline } from '@vicons/ionicons5';
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';
import type { Notification } from '@/types/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const router = useRouter();
const message = useMessage();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const unreadCount = computed(() => notificationStore.unreadCount);
const notifications = computed(() => notificationStore.notifications);

const formatTime = (time: string) => {
  return dayjs(time).fromNow();
};

const handleClick = async (item: Notification) => {
  // 标记已读
  if (!item.isRead) {
    await notificationStore.markAsRead(item.id);
  }
  // 通知面板常用于触发“外部状态变化”（例如退款到账），这里顺便同步一次用户信息
  authStore.loadCurrentUser().catch(() => {});
  // 跳转到订单详情
  if (item.orderId) {
    router.push({ path: '/orders', query: { orderId: item.orderId } });
  }
};

const handleDelete = async (id: number) => {
  await notificationStore.deleteNotification(id);
  message.success('删除成功');
};

const onPopoverChange = async (show: boolean) => {
  if (show && notifications.value.length === 0) {
    await notificationStore.fetchNotifications();
  }
  if (show) {
    authStore.loadCurrentUser().catch(() => {});
  }
};

onMounted(async () => {
  await notificationStore.fetchUnreadCount();
});
</script>

<style scoped>
.bell-btn {
  color: #64748b;
}

.bell-btn:hover {
  color: #0f766e;
}

.notification-panel {
  margin: -12px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.panel-header .count {
  font-size: 12px;
  color: #ef4444;
}

.notification-list {
  padding: 8px 0;
}

.notification-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8fafc;
}

.notification-item.unread {
  background-color: #f0fdf4;
}

.notification-item.unread:hover {
  background-color: #ecfdf5;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.item-content {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 4px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-time {
  font-size: 12px;
  color: #94a3b8;
}

.empty-state {
  padding: 40px 0;
}
</style>
