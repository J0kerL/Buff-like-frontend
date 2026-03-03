import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const routes = [
    {
        path: '/auth',
        name: 'auth',
        component: () => import('@/views/AuthView.vue'),
        meta: { public: true }
    },
    {
        path: '/',
        component: () => import('@/views/AppLayout.vue'),
        children: [
            { path: '', redirect: '/dashboard' },
            { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
            { path: 'market', name: 'market', component: () => import('@/views/MarketView.vue') },
            { path: 'inventory', name: 'inventory', component: () => import('@/views/InventoryView.vue') },
            { path: 'orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
            { path: 'wallet', name: 'wallet', component: () => import('@/views/WalletView.vue') }
        ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach((to) => {
    const authStore = useAuthStore();
    if (to.meta.public) {
        if (authStore.accessToken) {
            return '/dashboard';
        }
        return true;
    }
    if (!authStore.accessToken) {
        return '/auth';
    }
    return true;
});
export default router;
