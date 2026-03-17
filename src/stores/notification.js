import { defineStore } from 'pinia';
import { notificationApi } from '@/api/modules';
import { useAuthStore } from './auth';
export const useNotificationStore = defineStore('notification', {
    state: () => ({
        unreadCount: 0,
        notifications: [],
        ws: null,
        connected: false
    }),
    actions: {
        async fetchUnreadCount() {
            try {
                this.unreadCount = await notificationApi.unreadCount();
            }
            catch (error) {
                console.error('获取未读通知数量失败:', error);
            }
        },
        async fetchNotifications(pageNum = 1, pageSize = 20) {
            try {
                const result = await notificationApi.list({ pageNum, pageSize });
                this.notifications = result.list;
                return result;
            }
            catch (error) {
                console.error('获取通知列表失败:', error);
                return { total: 0, list: [], pageNum: 1, pageSize: 20, totalPages: 0 };
            }
        },
        async markAsRead(id) {
            try {
                await notificationApi.markAsRead(id);
                const notification = this.notifications.find(n => n.id === id);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    this.unreadCount = Math.max(0, this.unreadCount - 1);
                }
            }
            catch (error) {
                console.error('标记已读失败:', error);
            }
        },
        async markAsReadByOrderId(orderId) {
            try {
                await notificationApi.markAsReadByOrderId(orderId);
                // 更新本地通知状态
                const unreadNotifications = this.notifications.filter(n => n.orderId === orderId && !n.isRead);
                unreadNotifications.forEach(n => {
                    n.isRead = true;
                });
                this.unreadCount = Math.max(0, this.unreadCount - unreadNotifications.length);
            }
            catch (error) {
                console.error('根据订单ID标记已读失败:', error);
            }
        },
        async deleteNotification(id) {
            try {
                await notificationApi.delete(id);
                const index = this.notifications.findIndex(n => n.id === id);
                if (index !== -1) {
                    const notification = this.notifications[index];
                    if (!notification.isRead) {
                        this.unreadCount = Math.max(0, this.unreadCount - 1);
                    }
                    this.notifications.splice(index, 1);
                }
            }
            catch (error) {
                console.error('删除通知失败:', error);
            }
        },
        handleNewNotification(notification) {
            // 添加到列表头部
            this.notifications.unshift(notification);
            // 增加未读计数
            if (!notification.isRead) {
                this.unreadCount++;
            }
        },
        connectWebSocket() {
            const authStore = useAuthStore();
            if (!authStore.accessToken) {
                console.warn('未登录，跳过WebSocket连接');
                return;
            }
            // 如果已连接，先断开
            if (this.ws) {
                this.disconnectWebSocket();
            }
            // 构建WebSocket URL
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = import.meta.env.VITE_WS_HOST || window.location.host;
            const wsUrl = `${protocol}//${host}/ws/notification?token=${authStore.accessToken}`;
            try {
                this.ws = new WebSocket(wsUrl);
                this.ws.onopen = () => {
                    console.log('WebSocket连接成功');
                    this.connected = true;
                };
                this.ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        if (message.type === 'notification' && message.data) {
                            this.handleNewNotification(message.data);
                            // 收到通知时同步刷新用户余额
                            useAuthStore().loadCurrentUser().catch(() => { });
                        }
                    }
                    catch (error) {
                        console.error('解析WebSocket消息失败:', error);
                    }
                };
                this.ws.onerror = (error) => {
                    console.error('WebSocket错误:', error);
                };
                this.ws.onclose = () => {
                    console.log('WebSocket连接关闭');
                    this.connected = false;
                    this.ws = null;
                    // 5秒后尝试重连
                    setTimeout(() => {
                        if (useAuthStore().accessToken) {
                            this.connectWebSocket();
                        }
                    }, 5000);
                };
                // 心跳检测
                const heartbeat = setInterval(() => {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.ws.send('ping');
                    }
                    else {
                        clearInterval(heartbeat);
                    }
                }, 30000);
            }
            catch (error) {
                console.error('WebSocket连接失败:', error);
            }
        },
        disconnectWebSocket() {
            if (this.ws) {
                this.ws.close();
                this.ws = null;
                this.connected = false;
            }
        }
    }
});
